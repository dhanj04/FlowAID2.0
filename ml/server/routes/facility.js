const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();
const { Timestamp } = admin.firestore;

// Get current facility state
router.get('/', async (req, res) => {
  try {
    const facilityDoc = await db.collection('system').doc('facility').get();
    
    if (!facilityDoc.exists) {
      // Create default facility state if it doesn't exist
      const defaultState = {
        resources: {
          doctors: 3,
          nurses: 5,
          rooms: 4
        },
        departmentLoads: {
          'General': 0.4,
          'Emergency': 0.7,
          'Pediatrics': 0.3,
          'Cardiology': 0.5,
          'Orthopedics': 0.4
        },
        averageProcessingTimes: {
          'General': 20,
          'Emergency': 15,
          'Pediatrics': 25,
          'Cardiology': 30,
          'Orthopedics': 35
        },
        currentPatientCount: 0,
        peakHours: false,
        averageProcessingTime: 20,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp()
      };
      
      await db.collection('system').doc('facility').set(defaultState);
      return res.status(200).json(defaultState);
    }
    
    const facilityState = facilityDoc.data();
    
    res.status(200).json(facilityState);
  } catch (error) {
    console.error('Failed to fetch facility state:', error);
    res.status(500).json({ error: 'Failed to fetch facility state' });
  }
});

// Update resources
router.patch('/resources', async (req, res) => {
  try {
    const { doctors, nurses, rooms } = req.body;
    
    // Basic validation
    if (typeof doctors !== 'number' || typeof nurses !== 'number' || typeof rooms !== 'number') {
      return res.status(400).json({ error: 'Invalid resource values' });
    }
    
    const facilityRef = db.collection('system').doc('facility');
    
    await facilityRef.update({
      'resources.doctors': doctors,
      'resources.nurses': nurses,
      'resources.rooms': rooms,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Trigger queue update
    await db.collection('system').doc('queue').set({
      updateNeeded: true,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    
    res.status(200).json({
      resources: { doctors, nurses, rooms },
      message: 'Resources updated successfully'
    });
  } catch (error) {
    console.error('Failed to update resources:', error);
    res.status(500).json({ error: 'Failed to update resources' });
  }
});

// Update department loads
router.patch('/departments', async (req, res) => {
  try {
    const { departmentLoads } = req.body;
    
    // Basic validation
    if (!departmentLoads || typeof departmentLoads !== 'object') {
      return res.status(400).json({ error: 'Invalid department loads data' });
    }
    
    const facilityRef = db.collection('system').doc('facility');
    
    await facilityRef.update({
      departmentLoads,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Trigger queue update
    await db.collection('system').doc('queue').set({
      updateNeeded: true,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    
    res.status(200).json({
      departmentLoads,
      message: 'Department loads updated successfully'
    });
  } catch (error) {
    console.error('Failed to update department loads:', error);
    res.status(500).json({ error: 'Failed to update department loads' });
  }
});

// Update processing times
router.patch('/processing-times', async (req, res) => {
  try {
    const { processingTimes } = req.body;
    
    // Basic validation
    if (!processingTimes || typeof processingTimes !== 'object') {
      return res.status(400).json({ error: 'Invalid processing times data' });
    }
    
    const facilityRef = db.collection('system').doc('facility');
    
    await facilityRef.update({
      averageProcessingTimes: processingTimes,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Calculate global average processing time
    const departments = Object.keys(processingTimes);
    const totalTime = departments.reduce((sum, dept) => sum + processingTimes[dept], 0);
    const averageProcessingTime = Math.round(totalTime / departments.length);
    
    // Update global average
    await facilityRef.update({
      averageProcessingTime
    });
    
    // Trigger queue update
    await db.collection('system').doc('queue').set({
      updateNeeded: true,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    
    res.status(200).json({
      processingTimes,
      averageProcessingTime,
      message: 'Processing times updated successfully'
    });
  } catch (error) {
    console.error('Failed to update processing times:', error);
    res.status(500).json({ error: 'Failed to update processing times' });
  }
});

// Get facility statistics
router.get('/stats', async (req, res) => {
  try {
    // Get current facility state
    const facilityDoc = await db.collection('system').doc('facility').get();
    
    if (!facilityDoc.exists) {
      return res.status(404).json({ error: 'Facility state not found' });
    }
    
    const facilityState = facilityDoc.data();
    
    // Get patient stats
    const waitingSnapshot = await db.collection('patients')
      .where('status', '==', 'waiting')
      .get();
    
    const inProgressSnapshot = await db.collection('patients')
      .where('status', '==', 'in-progress')
      .get();
    
    const completedTodaySnapshot = await db.collection('patients')
      .where('status', '==', 'completed')
      .get();
    
    // Group patients by department
    const departmentCounts = {};
    const urgencyCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    waitingSnapshot.forEach(doc => {
      const data = doc.data();
      departmentCounts[data.department] = (departmentCounts[data.department] || 0) + 1;
      urgencyCounts[data.urgencyLevel] = (urgencyCounts[data.urgencyLevel] || 0) + 1;
    });
    
    // Calculate wait time statistics
    let totalWaitTime = 0;
    let maxWaitTime = 0;
    let waitTimeSamples = [];
    
    waitingSnapshot.forEach(doc => {
      const data = doc.data();
      const waitTime = data.currentWaitTime || 0;
      totalWaitTime += waitTime;
      if (waitTime > maxWaitTime) maxWaitTime = waitTime;
      waitTimeSamples.push(waitTime);
    });
    
    const avgWaitTime = waitingSnapshot.size > 0 ? Math.round(totalWaitTime / waitingSnapshot.size) : 0;
    
    // Create department distribution data
    const departmentDistribution = Object.keys(facilityState.departmentLoads || {}).map(dept => ({
      department: dept,
      count: departmentCounts[dept] || 0,
      load: facilityState.departmentLoads[dept] || 0
    }));
    
    // Create urgency distribution data
    const urgencyDistribution = Object.keys(urgencyCounts).map(level => ({
      level: Number(level),
      count: urgencyCounts[level] || 0
    }));
    
    // Generate wait time history (simulated for demo)
    const waitTimeHistory = [];
    const now = new Date();
    const startHour = new Date(now);
    startHour.setHours(8, 0, 0, 0); // Start at 8 AM
    
    for (let i = 0; i < 12; i++) { // 12 hours from 8 AM to 8 PM
      const hour = new Date(startHour);
      hour.setHours(hour.getHours() + i);
      
      // Simulated wait time curve that peaks during lunch hour
      let simulatedWaitTime;
      const hourNum = hour.getHours();
      if (hourNum === 12 || hourNum === 13) {
        // Peak at lunch time
        simulatedWaitTime = avgWaitTime * 1.5 + Math.random() * 10;
      } else if (hourNum >= 9 && hourNum <= 11) {
        // Morning peak
        simulatedWaitTime = avgWaitTime * 1.3 + Math.random() * 8;
      } else if (hourNum >= 14 && hourNum <= 16) {
        // Afternoon peak
        simulatedWaitTime = avgWaitTime * 1.2 + Math.random() * 7;
      } else {
        // Lower during other hours
        simulatedWaitTime = avgWaitTime * 0.8 + Math.random() * 5;
      }
      
      waitTimeHistory.push({
        time: hour.toISOString(),
        waitTime: Math.round(simulatedWaitTime)
      });
    }
    
    res.status(200).json({
      currentState: {
        waitingCount: waitingSnapshot.size,
        inProgressCount: inProgressSnapshot.size,
        completedTodayCount: completedTodaySnapshot.size,
        resources: facilityState.resources,
        averageWaitTime: avgWaitTime,
        maxWaitTime
      },
      departmentDistribution,
      urgencyDistribution,
      waitTimeHistory,
      waitTimeSamples
    });
  } catch (error) {
    console.error('Failed to fetch facility statistics:', error);
    res.status(500).json({ error: 'Failed to fetch facility statistics' });
  }
});

// Reset facility to default state
router.post('/reset', async (req, res) => {
  try {
    const defaultState = {
      resources: {
        doctors: 3,
        nurses: 5,
        rooms: 4
      },
      departmentLoads: {
        'General': 0.4,
        'Emergency': 0.7,
        'Pediatrics': 0.3,
        'Cardiology': 0.5,
        'Orthopedics': 0.4
      },
      averageProcessingTimes: {
        'General': 20,
        'Emergency': 15,
        'Pediatrics': 25,
        'Cardiology': 30,
        'Orthopedics': 35
      },
      currentPatientCount: 0,
      peakHours: false,
      averageProcessingTime: 20,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    };
    
    await db.collection('system').doc('facility').set(defaultState);
    
    // Trigger queue update
    await db.collection('system').doc('queue').set({
      updateNeeded: true,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    
    res.status(200).json({
      message: 'Facility reset successfully',
      state: defaultState
    });
  } catch (error) {
    console.error('Failed to reset facility:', error);
    res.status(500).json({ error: 'Failed to reset facility' });
  }
});

module.exports = router; 
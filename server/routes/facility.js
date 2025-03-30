const express = require('express');
const router = express.Router();

// Mock facility state
let facilityState = {
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
  lastUpdated: new Date().toISOString()
};

// Get current facility state
router.get('/', (req, res) => {
  res.status(200).json(facilityState);
});

// Update resources
router.patch('/resources', (req, res) => {
  const { doctors, nurses, rooms } = req.body;
  
  // Basic validation
  if (typeof doctors !== 'number' || typeof nurses !== 'number' || typeof rooms !== 'number') {
    return res.status(400).json({ error: 'Invalid resource values' });
  }
  
  // Update resources
  facilityState.resources = {
    ...facilityState.resources,
    doctors,
    nurses,
    rooms
  };
  
  facilityState.lastUpdated = new Date().toISOString();
  
  res.status(200).json({
    resources: facilityState.resources,
    message: 'Resources updated successfully'
  });
});

// Update department loads
router.patch('/departments', (req, res) => {
  const { departmentLoads } = req.body;
  
  // Basic validation
  if (!departmentLoads || typeof departmentLoads !== 'object') {
    return res.status(400).json({ error: 'Invalid department loads data' });
  }
  
  // Update department loads
  facilityState.departmentLoads = {
    ...facilityState.departmentLoads,
    ...departmentLoads
  };
  
  facilityState.lastUpdated = new Date().toISOString();
  
  res.status(200).json({
    departmentLoads: facilityState.departmentLoads,
    message: 'Department loads updated successfully'
  });
});

// Update processing times
router.patch('/processing-times', (req, res) => {
  const { processingTimes } = req.body;
  
  // Basic validation
  if (!processingTimes || typeof processingTimes !== 'object') {
    return res.status(400).json({ error: 'Invalid processing times data' });
  }
  
  // Update processing times
  facilityState.averageProcessingTimes = {
    ...facilityState.averageProcessingTimes,
    ...processingTimes
  };
  
  // Calculate global average processing time
  const departments = Object.keys(facilityState.averageProcessingTimes);
  const totalTime = departments.reduce((sum, dept) => 
    sum + facilityState.averageProcessingTimes[dept], 0);
  facilityState.averageProcessingTime = Math.round(totalTime / departments.length);
  
  facilityState.lastUpdated = new Date().toISOString();
  
  res.status(200).json({
    processingTimes: facilityState.averageProcessingTimes,
    averageProcessingTime: facilityState.averageProcessingTime,
    message: 'Processing times updated successfully'
  });
});

// Get facility statistics
router.get('/stats', (req, res) => {
  // Generate some mock statistics
  const departmentDistribution = Object.keys(facilityState.departmentLoads).map(dept => ({
    department: dept,
    count: Math.floor(Math.random() * 10),
    load: facilityState.departmentLoads[dept]
  }));
  
  const urgencyDistribution = [1, 2, 3, 4, 5].map(level => ({
    level,
    count: Math.floor(Math.random() * 10)
  }));
  
  // Generate wait time history (last 12 hours)
  const waitTimeHistory = [];
  const now = new Date();
  
  for (let i = 0; i < 12; i++) {
    const hour = new Date(now);
    hour.setHours(hour.getHours() - (11 - i));
    
    waitTimeHistory.push({
      time: hour.toISOString(),
      waitTime: Math.floor(Math.random() * 30) + 10
    });
  }
  
  const stats = {
    currentState: {
      waitingCount: Math.floor(Math.random() * 20) + 5,
      inProgressCount: Math.floor(Math.random() * 10) + 3,
      completedTodayCount: Math.floor(Math.random() * 40) + 20,
      resources: facilityState.resources,
      averageWaitTime: Math.floor(Math.random() * 20) + 10,
      maxWaitTime: Math.floor(Math.random() * 40) + 20
    },
    departmentDistribution,
    urgencyDistribution,
    waitTimeHistory,
    waitTimeSamples: Array.from({ length: 20 }, () => Math.floor(Math.random() * 30))
  };
  
  res.status(200).json(stats);
});

// Reset facility to default state
router.post('/reset', (req, res) => {
  facilityState = {
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
    lastUpdated: new Date().toISOString()
  };
  
  res.status(200).json({
    message: 'Facility reset successfully',
    state: facilityState
  });
});

module.exports = router; 
const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();
const { Timestamp } = admin.firestore;
const tf = require('@tensorflow/tfjs-node');
const path = require('path');
const fs = require('fs');

// Import our ML model
const QueueOptimizationModel = require('../models/QueueOptimizationModel');
const queueModel = new QueueOptimizationModel();

// Get the current queue (all patients)
router.get('/', async (req, res) => {
  try {
    // Get all patients that are either waiting or in-progress
    const snapshot = await db.collection('patients')
      .where('status', 'in', ['waiting', 'in-progress'])
      .orderBy('priorityScore', 'desc')
      .get();
    
    if (snapshot.empty) {
      return res.status(200).json([]);
    }
    
    const patients = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      // Convert timestamps to ISO strings
      if (data.arrivalTime) {
        data.arrivalTime = data.arrivalTime.toDate().toISOString();
      }
      if (data.appointmentTime) {
        data.appointmentTime = data.appointmentTime.toDate().toISOString();
      }
      patients.push({
        id: doc.id,
        ...data
      });
    });
    
    // Get current facility state
    const facilityDoc = await db.collection('system').doc('facility').get();
    const facilityState = facilityDoc.exists ? facilityDoc.data() : {
      resources: { doctors: 3, nurses: 5, rooms: 4 },
      departmentLoads: {},
      currentPatientCount: patients.length
    };
    
    res.status(200).json({
      patients,
      facilityState,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to fetch queue:', error);
    res.status(500).json({ error: 'Failed to fetch queue' });
  }
});

// Get queue by department
router.get('/department/:department', async (req, res) => {
  try {
    const { department } = req.params;
    
    // Get patients for specific department
    const snapshot = await db.collection('patients')
      .where('department', '==', department)
      .where('status', 'in', ['waiting', 'in-progress'])
      .orderBy('priorityScore', 'desc')
      .get();
    
    if (snapshot.empty) {
      return res.status(200).json([]);
    }
    
    const patients = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      // Convert timestamps to ISO strings
      if (data.arrivalTime) {
        data.arrivalTime = data.arrivalTime.toDate().toISOString();
      }
      if (data.appointmentTime) {
        data.appointmentTime = data.appointmentTime.toDate().toISOString();
      }
      patients.push({
        id: doc.id,
        ...data
      });
    });
    
    res.status(200).json(patients);
  } catch (error) {
    console.error('Failed to fetch department queue:', error);
    res.status(500).json({ error: 'Failed to fetch department queue' });
  }
});

// Force update the queue optimization
router.post('/update', async (req, res) => {
  try {
    // Get all patients in waiting status
    const snapshot = await db.collection('patients')
      .where('status', '==', 'waiting')
      .get();
    
    if (snapshot.empty) {
      return res.status(200).json({ message: 'No patients to optimize' });
    }
    
    // Get facility state
    const facilityDoc = await db.collection('system').doc('facility').get();
    let facilityState = {};
    
    if (facilityDoc.exists) {
      facilityState = facilityDoc.data();
    } else {
      // Default facility state
      facilityState = {
        resources: { doctors: 3, nurses: 5, rooms: 4 },
        departmentLoads: {},
        currentPatientCount: 0,
        averageProcessingTime: 20,
        peakHours: false
      };
      
      // Save default facility state
      await db.collection('system').doc('facility').set(facilityState);
    }
    
    // Update patient count in facility state
    facilityState.currentPatientCount = snapshot.size;
    
    // Determine if it's peak hours (9-11am or 1-3pm)
    const now = new Date();
    const hour = now.getHours();
    facilityState.peakHours = (hour >= 9 && hour <= 11) || (hour >= 13 && hour <= 15);
    
    // For a real system, we would call the ML model here
    // For now, we'll use a simple priority calculation
    
    // First batch: calculate base priorities
    const batch = db.batch();
    const patientUpdates = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const patientRef = db.collection('patients').doc(doc.id);
      
      // Calculate current wait time
      const arrivalTime = data.arrivalTime.toDate();
      const currentWaitTime = Math.round((now.getTime() - arrivalTime.getTime()) / (1000 * 60));
      
      // Calculate priority score using a simplified algorithm
      // Higher urgency, longer wait time, and special needs increase priority
      const urgencyWeight = data.urgencyLevel * 10;
      const waitTimeWeight = Math.log(currentWaitTime + 1) * 3;
      const specialNeedsWeight = data.specialNeeds ? 5 : 0;
      
      // Appointment type weights
      let typeWeight = 1;
      if (data.appointmentType === 'urgent') typeWeight = 3;
      else if (data.appointmentType === 'specialist') typeWeight = 2;
      else if (data.appointmentType === 'follow-up') typeWeight = 1.5;
      
      // Age group weights
      let ageWeight = 1;
      if (data.ageGroup === 'child') ageWeight = 1.3;
      else if (data.ageGroup === 'senior') ageWeight = 1.2;
      
      // Appointment time factor
      let appointmentFactor = 0;
      if (data.appointmentTime) {
        const apptTime = data.appointmentTime.toDate();
        const diffMs = now.getTime() - apptTime.getTime();
        const diffMinutes = diffMs / (1000 * 60);
        
        // If patient is on time or early for appointment, increase priority
        if (diffMinutes >= -15 && diffMinutes <= 15) {
          appointmentFactor = 10;
        }
      }
      
      // Combined priority score
      const priorityScore = 
        urgencyWeight + 
        waitTimeWeight +
        specialNeedsWeight +
        (typeWeight * 5) +
        (ageWeight * 2) +
        appointmentFactor;
      
      // Simple wait time prediction
      const baseWaitTime = facilityState.averageProcessingTime || 20;
      const departmentLoad = facilityState.departmentLoads[data.department] || 0.5;
      const resourceFactor = 1 / Math.max(0.2, (
        facilityState.resources.doctors / 5 +
        facilityState.resources.nurses / 10 +
        facilityState.resources.rooms / 7
      ) / 3);
      
      const predictedWaitTime = Math.round(
        baseWaitTime * 
        (1 + departmentLoad) * 
        resourceFactor * 
        (facilityState.peakHours ? 1.5 : 1) *
        (1 - (data.urgencyLevel - 1) * 0.1)
      );
      
      // Update patient
      batch.update(patientRef, {
        currentWaitTime,
        predictedWaitTime,
        priorityScore,
        lastUpdated: admin.firestore.Timestamp.fromDate(now)
      });
      
      patientUpdates.push({
        id: doc.id,
        currentWaitTime,
        predictedWaitTime,
        priorityScore
      });
    });
    
    // Commit all updates
    await batch.commit();
    
    // Update the queue update timestamp
    await db.collection('system').doc('queue').set({
      lastUpdated: admin.firestore.Timestamp.fromDate(now),
      updateNeeded: false
    }, { merge: true });
    
    res.status(200).json({ 
      message: 'Queue updated successfully',
      updatedPatients: patientUpdates
    });
  } catch (error) {
    console.error('Failed to update queue:', error);
    res.status(500).json({ error: 'Failed to update queue' });
  }
});

// Calculate wait time in minutes
function calculateWaitTime(arrivalTime) {
  const now = new Date();
  const diffMs = now - arrivalTime;
  return Math.floor(diffMs / 60000); // convert milliseconds to minutes
}

// Check if current time is peak hours
function isPeakHours() {
  const now = new Date();
  const hour = now.getHours();
  return (hour >= 9 && hour <= 11) || (hour >= 13 && hour <= 15);
}

// Get enriched queue with full patient data
async function getEnrichedQueue(queueWithPredictions, resourceAllocations) {
  const enrichedQueue = [];
  
  for (const item of queueWithPredictions) {
    const patientDoc = await db.collection('patients').doc(item.id).get();
    if (patientDoc.exists) {
      const patientData = patientDoc.data();
      
      // Parse resource allocation
      let assignedResources = null;
      if (resourceAllocations[item.id]) {
        const resourceIds = resourceAllocations[item.id].resourceId.split('|');
        assignedResources = {
          doctor: resourceIds[0] || null,
          nurse: resourceIds[1] || null,
          room: resourceIds[2] || null
        };
      }
      
      enrichedQueue.push({
        id: patientDoc.id,
        name: patientData.name,
        urgencyLevel: patientData.urgencyLevel,
        appointmentType: patientData.appointmentType,
        ageGroup: patientData.ageGroup,
        specialNeeds: patientData.specialNeeds,
        appointmentTime: patientData.appointmentTime ? patientData.appointmentTime.toDate() : null,
        arrivalTime: patientData.arrivalTime.toDate(),
        estimatedProcedureTime: patientData.estimatedProcedureTime,
        department: patientData.department,
        status: patientData.status,
        currentWaitTime: calculateWaitTime(patientData.arrivalTime.toDate()),
        predictedWaitTime: item.predictedWaitTime,
        priorityScore: item.priorityScore,
        assignedResources
      });
    }
  }
  
  return enrichedQueue;
}

// Save queue predictions to Firestore
async function saveQueuePredictions(queueWithPredictions, resourceAllocations) {
  const batch = db.batch();
  
  for (const item of queueWithPredictions) {
    const patientRef = db.collection('patients').doc(item.id);
    
    // Parse resource allocation
    let assignedResources = null;
    if (resourceAllocations[item.id]) {
      const resourceIds = resourceAllocations[item.id].resourceId.split('|');
      assignedResources = {
        doctor: resourceIds[0] || null,
        nurse: resourceIds[1] || null,
        room: resourceIds[2] || null
      };
    }
    
    batch.update(patientRef, {
      predictedWaitTime: item.predictedWaitTime,
      priorityScore: item.priorityScore,
      assignedResources,
      lastUpdated: Timestamp.fromDate(new Date())
    });
  }
  
  await batch.commit();
}

module.exports = router; 
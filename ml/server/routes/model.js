const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();
const { Timestamp } = admin.firestore;

// Import our ML models
const QueueOptimizationModel = require('../models/QueueOptimizationModel');
const TrainingDataGenerator = require('../models/TrainingDataGenerator');

const queueModel = new QueueOptimizationModel();
const trainingGenerator = new TrainingDataGenerator();

// Train the model with new synthetic data
router.post('/train', async (req, res) => {
  try {
    const { sampleCount = 5000, epochs = 50 } = req.body;
    
    // Generate synthetic training data
    console.log(`Generating ${sampleCount} synthetic training samples...`);
    const trainingData = trainingGenerator.generateTrainingData(sampleCount);
    
    // Train the model
    console.log(`Training model with ${sampleCount} samples for ${epochs} epochs...`);
    const trainingStart = Date.now();
    const history = await queueModel.trainModel(trainingData, epochs);
    const trainingTime = (Date.now() - trainingStart) / 1000;
    
    // Save training metadata to Firestore
    await db.collection('system').doc('modelTraining').set({
      lastTrainingDate: Timestamp.fromDate(new Date()),
      sampleCount,
      epochs,
      trainingTimeSeconds: trainingTime,
      finalLoss: history.history.loss[history.history.loss.length - 1],
      finalValidationLoss: history.history.val_loss[history.history.val_loss.length - 1]
    });
    
    res.status(200).json({
      message: 'Model training completed successfully',
      trainingTimeSeconds: trainingTime,
      sampleCount,
      epochs,
      finalLoss: history.history.loss[history.history.loss.length - 1],
      finalValidationLoss: history.history.val_loss[history.history.val_loss.length - 1]
    });
  } catch (error) {
    console.error('Error training model:', error);
    res.status(500).json({ error: 'Failed to train model', details: error.message });
  }
});

// Generate sample patients for testing
router.post('/generate-samples', async (req, res) => {
  try {
    const { count = 10, addToDatabase = false } = req.body;
    
    // Generate patient dataset
    const patients = trainingGenerator.generatePatientDataset(count);
    
    // If addToDatabase is true, add these patients to the database
    if (addToDatabase) {
      const batch = db.batch();
      
      for (const patient of patients) {
        const now = new Date();
        
        // Convert to the format expected by Firestore
        const patientData = {
          name: `Patient ${patient.id.split('_')[1]}`, // Generate a name based on the ID
          urgencyLevel: patient.factors.urgencyLevel,
          appointmentType: patient.factors.appointmentType,
          ageGroup: patient.factors.ageGroup,
          specialNeeds: patient.factors.specialNeeds,
          appointmentTime: patient.factors.appointmentTime 
            ? Timestamp.fromDate(patient.factors.appointmentTime) 
            : null,
          arrivalTime: Timestamp.fromDate(patient.factors.arrivalTime),
          estimatedProcedureTime: patient.factors.estimatedProcedureTime,
          department: ['General', 'Emergency', 'Pediatrics', 'Cardiology', 'Orthopedics'][
            Math.floor(Math.random() * 5)
          ],
          status: 'waiting',
          priorityScore: 0,
          predictedWaitTime: 0,
          currentWaitTime: patient.currentWaitTime,
          assignedResources: null,
          createdAt: Timestamp.fromDate(now),
          lastUpdated: Timestamp.fromDate(now)
        };
        
        // Add to batch
        const patientRef = db.collection('patients').doc();
        batch.set(patientRef, patientData);
      }
      
      // Commit the batch
      await batch.commit();
      
      res.status(201).json({
        message: `Generated and added ${count} sample patients to the database`,
        patients: patients.map(p => ({
          ...p,
          factors: {
            ...p.factors,
            appointmentTime: p.factors.appointmentTime ? p.factors.appointmentTime.toISOString() : null,
            arrivalTime: p.factors.arrivalTime.toISOString()
          }
        }))
      });
    } else {
      // Just return the generated patients
      res.status(200).json({
        message: `Generated ${count} sample patients`,
        patients: patients.map(p => ({
          ...p,
          factors: {
            ...p.factors,
            appointmentTime: p.factors.appointmentTime ? p.factors.appointmentTime.toISOString() : null,
            arrivalTime: p.factors.arrivalTime.toISOString()
          }
        }))
      });
    }
  } catch (error) {
    console.error('Error generating sample patients:', error);
    res.status(500).json({ error: 'Failed to generate sample patients' });
  }
});

// Test the model with a single patient
router.post('/predict-wait-time', async (req, res) => {
  try {
    const {
      urgencyLevel,
      appointmentType,
      ageGroup,
      specialNeeds,
      appointmentTime,
      arrivalTime,
      estimatedProcedureTime,
      previousWaitHistory
    } = req.body;
    
    // Get current facility state
    const facilityDoc = await db.collection('facility').doc('current').get();
    if (!facilityDoc.exists) {
      return res.status(404).json({ error: 'Facility state not found' });
    }
    
    const facilityState = facilityDoc.data();
    
    // Create patient factors object
    const patientFactors = {
      urgencyLevel: Number(urgencyLevel) || 1,
      appointmentType: appointmentType || 'regular',
      ageGroup: ageGroup || 'adult',
      specialNeeds: Boolean(specialNeeds),
      appointmentTime: appointmentTime ? new Date(appointmentTime) : null,
      arrivalTime: arrivalTime ? new Date(arrivalTime) : new Date(),
      estimatedProcedureTime: Number(estimatedProcedureTime) || 20,
      previousWaitHistory: Number(previousWaitHistory) || 0
    };
    
    // Predict wait time
    const waitTime = await queueModel.predictWaitTime(patientFactors, {
      currentPatientCount: facilityState.currentPatientCount || 10,
      averageProcessingTime: facilityState.averageProcessingTime || 20,
      peakHours: isPeakHours(),
      resources: facilityState.resources || {
        doctors: 3,
        nurses: 5,
        rooms: 5,
        specialEquipment: {}
      },
      departmentLoads: facilityState.departmentLoads || {}
    });
    
    // Calculate priority score
    const currentWaitTime = 0; // New patient
    const priorityScore = queueModel.calculatePriorityScore(patientFactors, currentWaitTime);
    
    res.status(200).json({
      predictedWaitTime: waitTime,
      priorityScore,
      patientFactors: {
        ...patientFactors,
        appointmentTime: patientFactors.appointmentTime ? patientFactors.appointmentTime.toISOString() : null,
        arrivalTime: patientFactors.arrivalTime.toISOString()
      }
    });
  } catch (error) {
    console.error('Error predicting wait time:', error);
    res.status(500).json({ error: 'Failed to predict wait time' });
  }
});

// Get model info
router.get('/info', async (req, res) => {
  try {
    const modelDoc = await db.collection('system').doc('model').get();
    
    if (!modelDoc.exists) {
      // Create default model information if it doesn't exist
      const defaultModelInfo = {
        type: 'Neural Network',
        version: '1.0',
        lastTrained: null,
        datasetSize: 0,
        metrics: {
          mae: 0,
          rmse: 0
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };
      
      await db.collection('system').doc('model').set(defaultModelInfo);
      return res.status(200).json(defaultModelInfo);
    }
    
    const modelInfo = modelDoc.data();
    
    // Format dates for the client
    if (modelInfo.lastTrained) {
      modelInfo.lastTrained = modelInfo.lastTrained.toDate().toISOString();
    }
    if (modelInfo.createdAt) {
      modelInfo.createdAt = modelInfo.createdAt.toDate().toISOString();
    }
    
    res.status(200).json(modelInfo);
  } catch (error) {
    console.error('Failed to fetch model info:', error);
    res.status(500).json({ error: 'Failed to fetch model info' });
  }
});

// Check if current time is peak hours
function isPeakHours() {
  const now = new Date();
  const hour = now.getHours();
  return (hour >= 9 && hour <= 11) || (hour >= 13 && hour <= 15);
}

module.exports = router; 
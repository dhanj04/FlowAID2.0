const express = require('express');
const router = express.Router();

// Mock model state
let modelState = {
  trained: false,
  accuracy: 0,
  lastTrained: null,
  metrics: {
    mse: 0,
    mae: 0,
    r2: 0
  },
  features: [
    'urgency',
    'age',
    'department',
    'condition',
    'resources_needed',
    'time_of_day',
    'facility_load'
  ],
  sampleSize: 0
};

// Get model info
router.get('/', (req, res) => {
  res.status(200).json(modelState);
});

// Train the model
router.post('/train', (req, res) => {
  // Simulate model training
  const trainingTime = Math.floor(Math.random() * 2000) + 1000;
  
  setTimeout(() => {
    modelState.trained = true;
    modelState.lastTrained = new Date().toISOString();
    modelState.accuracy = Math.random() * 0.2 + 0.7; // Random accuracy between 0.7 and 0.9
    modelState.sampleSize = Math.floor(Math.random() * 500) + 100;
    modelState.metrics = {
      mse: Math.random() * 10,
      mae: Math.random() * 5,
      r2: Math.random() * 0.3 + 0.6
    };
    
    res.status(200).json({
      message: 'Model trained successfully',
      model: modelState
    });
  }, trainingTime);
});

// Generate sample patients for demo purposes
router.get('/sample', (req, res) => {
  const count = parseInt(req.query.count) || 5;
  const departments = ['General', 'Emergency', 'Pediatrics', 'Cardiology', 'Orthopedics'];
  const conditions = [
    'Fever', 'Broken Bone', 'Chest Pain', 'Headache', 'Allergic Reaction',
    'Laceration', 'Burn', 'Infection', 'Dizziness', 'Shortness of Breath'
  ];
  const statuses = ['waiting', 'in_progress', 'completed'];
  const resourceNeeds = [1, 2, 3];
  
  const samples = [];
  
  for (let i = 0; i < count; i++) {
    const urgency = Math.floor(Math.random() * 5) + 1;
    const now = new Date();
    const checkInTime = new Date(now.getTime() - Math.floor(Math.random() * 7200000)); // Up to 2 hours ago
    
    const sample = {
      id: `P${Math.floor(Math.random() * 10000)}`,
      name: `Sample Patient ${i + 1}`,
      age: Math.floor(Math.random() * 80) + 5,
      urgency,
      department: departments[Math.floor(Math.random() * departments.length)],
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      resources_needed: resourceNeeds[Math.floor(Math.random() * resourceNeeds.length)],
      check_in_time: checkInTime.toISOString(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: urgency * (Math.random() * 0.5 + 0.75) // Priority based on urgency with some randomness
    };
    
    // Add predicted wait time if the model is trained
    if (modelState.trained) {
      sample.predicted_wait_time = Math.floor(
        (6 - urgency) * 10 + 
        Math.random() * 20 - 
        sample.resources_needed * 3 +
        (sample.department === 'Emergency' ? -5 : 5)
      );
    }
    
    samples.push(sample);
  }
  
  res.status(200).json(samples);
});

// Predict wait time for a patient
router.post('/predict', (req, res) => {
  const { patient } = req.body;
  
  if (!patient) {
    return res.status(400).json({ error: 'Patient data is required' });
  }
  
  if (!modelState.trained) {
    return res.status(400).json({ error: 'Model has not been trained yet' });
  }
  
  // Basic validation
  const requiredFields = ['urgency', 'department', 'resources_needed'];
  for (const field of requiredFields) {
    if (patient[field] === undefined) {
      return res.status(400).json({ error: `Missing required field: ${field}` });
    }
  }
  
  // Simple prediction algorithm (mock)
  const baseTime = 30; // Base wait time in minutes
  
  // Factors affecting wait time
  const urgencyFactor = 6 - patient.urgency; // Higher urgency = lower wait time
  const resourceFactor = patient.resources_needed;
  const departmentFactor = 
    patient.department === 'Emergency' ? 0.7 : 
    patient.department === 'General' ? 1.2 : 
    patient.department === 'Pediatrics' ? 0.9 : 
    1.0;
  
  // Add some randomness
  const randomFactor = Math.random() * 0.3 + 0.85; // Random factor between 0.85 and 1.15
  
  // Calculate predicted wait time
  const predictedWaitTime = Math.round(
    baseTime * urgencyFactor * departmentFactor * resourceFactor * randomFactor
  );
  
  // Add confidence interval
  const confidenceLow = Math.round(predictedWaitTime * 0.8);
  const confidenceHigh = Math.round(predictedWaitTime * 1.2);
  
  res.status(200).json({
    predicted_wait_time: predictedWaitTime,
    confidence_interval: {
      low: confidenceLow,
      high: confidenceHigh
    },
    factors: {
      urgency: urgencyFactor,
      resources: resourceFactor,
      department: departmentFactor
    }
  });
});

module.exports = router; 
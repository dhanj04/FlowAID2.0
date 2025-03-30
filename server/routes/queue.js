const express = require('express');
const router = express.Router();

// Mock queue state
let queueState = {
  lastOptimized: new Date().toISOString(),
  optimizationInProgress: false,
  algorithm: 'multi-factor-priority',
  patients: [] // This will be populated dynamically
};

// Helper function to get waiting patients from patients module
const getWaitingPatients = () => {
  try {
    // In a real app, this would interact with a database
    // For this mock, we're getting patients from the patients route
    const patientsRouter = require('./patients');
    if (typeof patientsRouter.getPatients === 'function') {
      return patientsRouter.getPatients().filter(p => p.status === 'waiting');
    }
    // Create some sample patients if patients module doesn't expose a method
    return getMockPatients();
  } catch (error) {
    console.log('Error accessing patients:', error);
    return getMockPatients();
  }
};

// Helper function to generate mock patients if needed
const getMockPatients = () => {
  const departments = ['General', 'Emergency', 'Pediatrics', 'Cardiology', 'Orthopedics'];
  const conditions = [
    'Fever', 'Broken Bone', 'Chest Pain', 'Headache', 'Allergic Reaction',
    'Laceration', 'Burn', 'Infection', 'Dizziness', 'Shortness of Breath'
  ];
  
  return Array.from({ length: 5 }, (_, i) => {
    const urgency = Math.floor(Math.random() * 5) + 1;
    const now = new Date();
    const checkInTime = new Date(now.getTime() - Math.floor(Math.random() * 7200000)); // Up to 2 hours ago
    
    return {
      id: `P${1001 + i}`,
      name: `Queue Patient ${i + 1}`,
      age: Math.floor(Math.random() * 80) + 5,
      urgency,
      department: departments[Math.floor(Math.random() * departments.length)],
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      resources_needed: Math.floor(Math.random() * 3) + 1,
      check_in_time: checkInTime.toISOString(),
      status: 'waiting',
      priority: urgency * (Math.random() * 0.5 + 0.75),
      predicted_wait_time: Math.floor(Math.random() * 50) + 5
    };
  });
};

// Helper function to optimize the queue
const optimizeQueue = (patients) => {
  // In a real app, this would implement a sophisticated algorithm
  // For this mock, we'll just sort by priority (which factors in urgency already)
  return patients.sort((a, b) => b.priority - a.priority);
};

// Get current queue
router.get('/', (req, res) => {
  // Get waiting patients
  const waitingPatients = getMockPatients();
  
  // Optimize the queue
  const optimizedQueue = optimizeQueue(waitingPatients);
  
  // Update queue state
  queueState.patients = optimizedQueue;
  
  res.status(200).json({
    ...queueState,
    patients: optimizedQueue
  });
});

// Get queue for a specific department
router.get('/department/:department', (req, res) => {
  const { department } = req.params;
  
  // Get waiting patients
  const waitingPatients = getMockPatients();
  
  // Filter by department and optimize
  const departmentPatients = waitingPatients.filter(p => 
    p.department.toLowerCase() === department.toLowerCase()
  );
  
  const optimizedQueue = optimizeQueue(departmentPatients);
  
  res.status(200).json({
    department,
    patients: optimizedQueue,
    count: optimizedQueue.length,
    lastOptimized: queueState.lastOptimized
  });
});

// Force update the queue optimization
router.post('/update', (req, res) => {
  // Simulate an optimization process that takes some time
  queueState.optimizationInProgress = true;
  
  setTimeout(() => {
    // Get waiting patients
    const waitingPatients = getMockPatients();
    
    // Optimize the queue
    const optimizedQueue = optimizeQueue(waitingPatients);
    
    // Update queue state
    queueState.patients = optimizedQueue;
    queueState.lastOptimized = new Date().toISOString();
    queueState.optimizationInProgress = false;
    
    res.status(200).json({
      message: 'Queue optimization complete',
      ...queueState
    });
  }, 1000); // 1 second delay to simulate processing
});

module.exports = router; 
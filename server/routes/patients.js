const express = require('express');
const router = express.Router();

// Mock patients data
let patients = [
  {
    id: 'P1001',
    name: 'John Doe',
    age: 45,
    urgency: 3,
    department: 'General',
    condition: 'Fever',
    resources_needed: 1,
    check_in_time: new Date(Date.now() - 30 * 60000).toISOString(),
    status: 'waiting',
    priority: 2.8,
    predicted_wait_time: 25
  },
  {
    id: 'P1002',
    name: 'Jane Smith',
    age: 32,
    urgency: 4,
    department: 'Emergency',
    condition: 'Chest Pain',
    resources_needed: 2,
    check_in_time: new Date(Date.now() - 15 * 60000).toISOString(),
    status: 'in_progress',
    priority: 3.7,
    predicted_wait_time: 15
  },
  {
    id: 'P1003',
    name: 'Bob Johnson',
    age: 8,
    urgency: 2,
    department: 'Pediatrics',
    condition: 'Allergic Reaction',
    resources_needed: 1,
    check_in_time: new Date(Date.now() - 45 * 60000).toISOString(),
    status: 'waiting',
    priority: 1.8,
    predicted_wait_time: 35
  },
  {
    id: 'P1004',
    name: 'Emily Brown',
    age: 67,
    urgency: 5,
    department: 'Cardiology',
    condition: 'Shortness of Breath',
    resources_needed: 3,
    check_in_time: new Date(Date.now() - 10 * 60000).toISOString(),
    status: 'in_progress',
    priority: 4.5,
    predicted_wait_time: 5
  },
  {
    id: 'P1005',
    name: 'Michael Wilson',
    age: 28,
    urgency: 1,
    department: 'Orthopedics',
    condition: 'Broken Bone',
    resources_needed: 2,
    check_in_time: new Date(Date.now() - 60 * 60000).toISOString(),
    status: 'waiting',
    priority: 1.1,
    predicted_wait_time: 50
  }
];

// Helper function to generate a new patient ID
const generatePatientId = () => {
  const lastId = Math.max(...patients.map(p => parseInt(p.id.substring(1))));
  return `P${lastId + 1}`;
};

// Get all patients
router.get('/', (req, res) => {
  res.status(200).json(patients);
});

// Get a specific patient by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const patient = patients.find(p => p.id === id);
  
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }
  
  res.status(200).json(patient);
});

// Add a new patient
router.post('/', (req, res) => {
  const { 
    name, age, urgency, department, 
    condition, resources_needed, status = 'waiting' 
  } = req.body;
  
  // Basic validation
  if (!name || !age || !urgency || !department || !condition || !resources_needed) {
    return res.status(400).json({ error: 'Missing required patient information' });
  }
  
  // Create a new patient
  const newPatient = {
    id: generatePatientId(),
    name,
    age,
    urgency,
    department,
    condition,
    resources_needed,
    check_in_time: new Date().toISOString(),
    status,
    priority: urgency * (Math.random() * 0.5 + 0.75), // Simple priority calculation
    predicted_wait_time: null // Will be updated by the model
  };
  
  patients.push(newPatient);
  
  res.status(201).json(newPatient);
});

// Update a patient
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const patientIndex = patients.findIndex(p => p.id === id);
  
  if (patientIndex === -1) {
    return res.status(404).json({ error: 'Patient not found' });
  }
  
  // Update only the provided fields
  const updatedPatient = {
    ...patients[patientIndex],
    ...req.body,
    // Preserve the ID
    id: patients[patientIndex].id
  };
  
  patients[patientIndex] = updatedPatient;
  
  res.status(200).json(updatedPatient);
});

// Update patient status
router.patch('/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!status || !['waiting', 'in_progress', 'completed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }
  
  const patientIndex = patients.findIndex(p => p.id === id);
  
  if (patientIndex === -1) {
    return res.status(404).json({ error: 'Patient not found' });
  }
  
  patients[patientIndex] = {
    ...patients[patientIndex],
    status
  };
  
  // If marked as completed, we might want to perform additional actions
  if (status === 'completed') {
    // In a real app, you might update statistics, free up resources, etc.
    console.log(`Patient ${id} marked as completed`);
  }
  
  res.status(200).json(patients[patientIndex]);
});

// Delete a patient
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const patientIndex = patients.findIndex(p => p.id === id);
  
  if (patientIndex === -1) {
    return res.status(404).json({ error: 'Patient not found' });
  }
  
  const deletedPatient = patients[patientIndex];
  patients = patients.filter(p => p.id !== id);
  
  res.status(200).json({
    message: 'Patient deleted successfully',
    patient: deletedPatient
  });
});

module.exports = router; 
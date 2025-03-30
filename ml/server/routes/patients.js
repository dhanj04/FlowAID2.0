const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();
const { Timestamp } = admin.firestore;

// Get all patients (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { department, status } = req.query;
    
    let patientsRef = db.collection('patients');
    
    // Apply filters if provided
    if (department) {
      patientsRef = patientsRef.where('department', '==', department);
    }
    
    if (status) {
      patientsRef = patientsRef.where('status', '==', status);
    }
    
    const snapshot = await patientsRef.get();
    
    if (snapshot.empty) {
      return res.status(200).json([]);
    }
    
    const patients = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      // Convert timestamps to ISO strings for easy handling on frontend
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
    console.error('Failed to fetch patients:', error);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});

// Get a single patient by ID
router.get('/:id', async (req, res) => {
  try {
    const patientDoc = await db.collection('patients').doc(req.params.id).get();
    
    if (!patientDoc.exists) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    const patientData = patientDoc.data();
    // Convert timestamps to ISO strings
    if (patientData.arrivalTime) {
      patientData.arrivalTime = patientData.arrivalTime.toDate().toISOString();
    }
    if (patientData.appointmentTime) {
      patientData.appointmentTime = patientData.appointmentTime.toDate().toISOString();
    }
    
    res.status(200).json({
      id: patientDoc.id,
      ...patientData
    });
  } catch (error) {
    console.error('Failed to fetch patient:', error);
    res.status(500).json({ error: 'Failed to fetch patient' });
  }
});

// Add a new patient
router.post('/', async (req, res) => {
  try {
    const patientData = req.body;
    
    // Validate required fields
    if (!patientData.name || !patientData.urgencyLevel || !patientData.arrivalTime) {
      return res.status(400).json({ error: 'Missing required patient information' });
    }
    
    // Convert ISO strings to Firestore timestamps
    if (patientData.arrivalTime) {
      patientData.arrivalTime = admin.firestore.Timestamp.fromDate(new Date(patientData.arrivalTime));
    }
    if (patientData.appointmentTime) {
      patientData.appointmentTime = admin.firestore.Timestamp.fromDate(new Date(patientData.appointmentTime));
    }
    
    // Add default values
    const newPatient = {
      ...patientData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      currentWaitTime: 0,
      predictedWaitTime: 0,
      priorityScore: 0
    };
    
    const docRef = await db.collection('patients').add(newPatient);
    
    // Trigger queue update after adding a patient
    await db.collection('system').doc('queue').set({
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      updateNeeded: true
    }, { merge: true });
    
    res.status(201).json({
      id: docRef.id,
      ...patientData
    });
  } catch (error) {
    console.error('Failed to add patient:', error);
    res.status(500).json({ error: 'Failed to add patient' });
  }
});

// Update a patient's status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['waiting', 'in-progress', 'completed', 'cancelled'];
    
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const patientRef = db.collection('patients').doc(req.params.id);
    const doc = await patientRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    await patientRef.update({
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Trigger queue update after status change
    await db.collection('system').doc('queue').set({
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      updateNeeded: true
    }, { merge: true });
    
    res.status(200).json({ id: req.params.id, status });
  } catch (error) {
    console.error('Failed to update patient status:', error);
    res.status(500).json({ error: 'Failed to update patient status' });
  }
});

// Delete a patient
router.delete('/:id', async (req, res) => {
  try {
    const patientRef = db.collection('patients').doc(req.params.id);
    const doc = await patientRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    await patientRef.delete();
    
    // Trigger queue update after deleting a patient
    await db.collection('system').doc('queue').set({
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      updateNeeded: true
    }, { merge: true });
    
    res.status(200).json({ id: req.params.id, message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Failed to delete patient:', error);
    res.status(500).json({ error: 'Failed to delete patient' });
  }
});

module.exports = router; 
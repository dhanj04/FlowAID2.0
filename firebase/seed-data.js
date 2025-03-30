import { db } from './config';
import { 
  collection, 
  doc, 
  setDoc, 
  writeBatch, 
  serverTimestamp 
} from 'firebase/firestore';

// Function to seed the database with initial data
export const seedDatabase = async () => {
  try {
    const batch = writeBatch(db);
    
    // Seed doctors
    const doctors = [
      { 
        id: 'doctor1',
        name: 'Dr. Sarah Johnson', 
        specialty: 'Cardiology',
        email: 'sarah.johnson@flowaid.com',
        phone: '555-123-4567',
        availability: ['Monday', 'Wednesday', 'Friday'],
        bio: 'Board certified cardiologist with 15 years of experience in treating heart conditions.',
        imageUrl: '/images/doctors/sarah-johnson.jpg'
      },
      { 
        id: 'doctor2',
        name: 'Dr. Michael Chen', 
        specialty: 'Neurology',
        email: 'michael.chen@flowaid.com',
        phone: '555-234-5678',
        availability: ['Tuesday', 'Thursday'],
        bio: 'Specializes in neurological disorders with a focus on stroke prevention and treatment.',
        imageUrl: '/images/doctors/michael-chen.jpg'
      },
      { 
        id: 'doctor3',
        name: 'Dr. Priya Patel', 
        specialty: 'Pediatrics',
        email: 'priya.patel@flowaid.com',
        phone: '555-345-6789',
        availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        bio: 'Dedicated pediatrician with a passion for child wellness and preventative care.',
        imageUrl: '/images/doctors/priya-patel.jpg'
      },
      { 
        id: 'doctor4',
        name: 'Dr. James Wilson', 
        specialty: 'Orthopedics',
        email: 'james.wilson@flowaid.com',
        phone: '555-456-7890',
        availability: ['Monday', 'Wednesday', 'Friday'],
        bio: 'Orthopedic surgeon specializing in sports injuries and joint replacements.',
        imageUrl: '/images/doctors/james-wilson.jpg'
      },
      { 
        id: 'doctor5',
        name: 'Dr. Maria Rodriguez', 
        specialty: 'General',
        email: 'maria.rodriguez@flowaid.com',
        phone: '555-567-8901',
        availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        bio: 'Family medicine practitioner focused on holistic patient care and preventative medicine.',
        imageUrl: '/images/doctors/maria-rodriguez.jpg'
      }
    ];
    
    doctors.forEach(doctor => {
      const docRef = doc(db, 'doctors', doctor.id);
      batch.set(docRef, {
        ...doctor,
        createdAt: serverTimestamp()
      });
    });
    
    // Seed sample patients in queue
    const queuePatients = [
      {
        id: 'queue1',
        patientName: 'John Smith',
        patientId: 'patient1',
        age: 45,
        department: 'Cardiology',
        reason: 'Chest pain',
        priority: 3,
        status: 'Waiting',
        estimatedWaitTime: 35,
        arrivalTime: new Date(Date.now() - 30 * 60000).toISOString() // 30 minutes ago
      },
      {
        id: 'queue2',
        patientName: 'Emily Johnson',
        patientId: 'patient2',
        age: 8,
        department: 'Pediatrics',
        reason: 'Fever',
        priority: 2,
        status: 'Waiting',
        estimatedWaitTime: 20,
        arrivalTime: new Date(Date.now() - 15 * 60000).toISOString() // 15 minutes ago
      },
      {
        id: 'queue3',
        patientName: 'Robert Chen',
        patientId: 'patient3',
        age: 67,
        department: 'Neurology',
        reason: 'Dizziness',
        priority: 2,
        status: 'In Treatment',
        estimatedWaitTime: 0,
        arrivalTime: new Date(Date.now() - 45 * 60000).toISOString() // 45 minutes ago
      },
      {
        id: 'queue4',
        patientName: 'Sarah Williams',
        patientId: 'patient4',
        age: 29,
        department: 'Orthopedics',
        reason: 'Ankle injury',
        priority: 1,
        status: 'Waiting',
        estimatedWaitTime: 45,
        arrivalTime: new Date(Date.now() - 10 * 60000).toISOString() // 10 minutes ago
      },
      {
        id: 'queue5',
        patientName: 'Michael Brown',
        patientId: 'patient5',
        age: 52,
        department: 'General',
        reason: 'Annual checkup',
        priority: 1,
        status: 'Waiting',
        estimatedWaitTime: 60,
        arrivalTime: new Date(Date.now() - 5 * 60000).toISOString() // 5 minutes ago
      }
    ];
    
    queuePatients.forEach(patient => {
      const queueRef = doc(db, 'queue', patient.id);
      batch.set(queueRef, patient);
    });
    
    // Seed sample appointments
    const appointments = [
      {
        id: 'appointment1',
        patientId: 'patient1',
        patientName: 'John Smith',
        doctorId: 'doctor1',
        doctorName: 'Dr. Sarah Johnson',
        specialty: 'Cardiology',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
        time: '10:00 AM',
        reason: 'Follow-up on heart condition',
        status: 'Confirmed',
        notes: ''
      },
      {
        id: 'appointment2',
        patientId: 'patient2',
        patientName: 'Emily Johnson',
        doctorId: 'doctor3',
        doctorName: 'Dr. Priya Patel',
        specialty: 'Pediatrics',
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 day from now
        time: '2:30 PM',
        reason: 'Vaccination',
        status: 'Confirmed',
        notes: 'Bring vaccination record'
      },
      {
        id: 'appointment3',
        patientId: 'patient3',
        patientName: 'Robert Chen',
        doctorId: 'doctor2',
        doctorName: 'Dr. Michael Chen',
        specialty: 'Neurology',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
        time: '11:15 AM',
        reason: 'MRI results review',
        status: 'Pending',
        notes: 'Patient needs to bring previous MRI reports'
      }
    ];
    
    appointments.forEach(appointment => {
      const appointmentRef = doc(db, 'appointments', appointment.id);
      batch.set(appointmentRef, {
        ...appointment,
        createdAt: serverTimestamp()
      });
    });
    
    // Seed model information
    const modelRef = doc(db, 'model', 'current');
    batch.set(modelRef, {
      version: '1.2.0',
      lastTrained: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      accuracy: 0.87,
      parameters: {
        waitTimeFactors: {
          patientVolume: 0.4,
          staffAvailability: 0.3,
          priorityWeight: 0.2,
          timeOfDay: 0.1
        },
        resourceAllocation: {
          doctors: 0.35,
          nurses: 0.35,
          rooms: 0.3
        }
      },
      createdAt: serverTimestamp()
    });
    
    // Commit the batch
    await batch.commit();
    console.log('Database seeded successfully');
    return { success: true };
  } catch (error) {
    console.error('Error seeding database:', error);
    return { success: false, error: error.message };
  }
};

// Function to seed a single user (useful for testing)
export const seedUser = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error seeding user:', error);
    return { success: false, error: error.message };
  }
};

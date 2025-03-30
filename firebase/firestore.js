import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './config';

// User-related functions
export const getUserProfile = async (userId) => {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

export const updateUserProfile = async (userId, data) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
};

// Doctor-related functions
export const getDoctors = async (specialty = null) => {
  let doctorsQuery;
  
  if (specialty) {
    doctorsQuery = query(
      collection(db, 'doctors'),
      where('specialty', '==', specialty),
      orderBy('name')
    );
  } else {
    doctorsQuery = query(
      collection(db, 'doctors'),
      orderBy('name')
    );
  }
  
  const querySnapshot = await getDocs(doctorsQuery);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const getDoctorById = async (doctorId) => {
  const docRef = doc(db, 'doctors', doctorId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

// Appointment-related functions
export const getAppointmentsByPatient = async (patientId) => {
  const appointmentsQuery = query(
    collection(db, 'appointments'),
    where('patientId', '==', patientId),
    orderBy('date'),
    orderBy('time')
  );
  
  const querySnapshot = await getDocs(appointmentsQuery);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const getAppointmentsByDoctor = async (doctorId) => {
  const appointmentsQuery = query(
    collection(db, 'appointments'),
    where('doctorId', '==', doctorId),
    orderBy('date'),
    orderBy('time')
  );
  
  const querySnapshot = await getDocs(appointmentsQuery);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const createAppointment = async (appointmentData) => {
  const result = await addDoc(collection(db, 'appointments'), {
    ...appointmentData,
    status: 'Pending',
    createdAt: serverTimestamp()
  });
  return result.id;
};

export const updateAppointment = async (appointmentId, data) => {
  const appointmentRef = doc(db, 'appointments', appointmentId);
  await updateDoc(appointmentRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
};

// Queue-related functions
export const getQueueByDepartment = async (department) => {
  const queueQuery = query(
    collection(db, 'queue'),
    where('department', '==', department),
    orderBy('priority', 'desc'),
    orderBy('arrivalTime')
  );
  
  const querySnapshot = await getDocs(queueQuery);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const addPatientToQueue = async (patientData) => {
  const result = await addDoc(collection(db, 'queue'), {
    ...patientData,
    arrivalTime: serverTimestamp(),
    status: 'Waiting'
  });
  return result.id;
};

export const updatePatientStatus = async (queueId, status) => {
  const queueRef = doc(db, 'queue', queueId);
  await updateDoc(queueRef, {
    status,
    updatedAt: serverTimestamp()
  });
};

// Model-related functions
export const getModelInfo = async () => {
  const docRef = doc(db, 'model', 'current');
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

export const updateModelInfo = async (modelData) => {
  const modelRef = doc(db, 'model', 'current');
  await updateDoc(modelRef, {
    ...modelData,
    updatedAt: serverTimestamp()
  });
};

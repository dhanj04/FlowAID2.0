import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// In development mode, use the Firebase emulator if available
const useEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// In development, connect to the emulators
if (typeof window !== 'undefined' && useEmulator && process.env.NODE_ENV === 'development') {
  import('firebase/firestore').then(({ connectFirestoreEmulator }) => {
    try {
      // @ts-ignore - connectFirestoreEmulator might already be connected
      if (firestore._settingsFrozen === false) {
        connectFirestoreEmulator(firestore, 'localhost', 8080);
        console.log('Connected to Firestore emulator');
      }
    } catch (error) {
      console.error('Failed to connect to Firestore emulator:', error);
    }
  });

  import('firebase/auth').then(({ connectAuthEmulator }) => {
    try {
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      console.log('Connected to Auth emulator');
    } catch (error) {
      console.error('Failed to connect to Auth emulator:', error);
    }
  });

  import('firebase/storage').then(({ connectStorageEmulator }) => {
    try {
      connectStorageEmulator(storage, 'localhost', 9199);
      console.log('Connected to Storage emulator');
    } catch (error) {
      console.error('Failed to connect to Storage emulator:', error);
    }
  });
}

export { app, firestore, auth, storage }; 
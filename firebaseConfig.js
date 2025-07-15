// firebaseConfig.js
import { initializeApp } from 'firebase/app';
// You'll also import any specific services you need, like Auth or Firestore
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDhLVRo1_y81zLN4U-wdHCE3zi7MAp71zE",
  authDomain: "hi-lo-card-counter.firebaseapp.com",
  projectId: "hi-lo-card-counter",
  storageBucket: "hi-lo-card-counter.firebasestorage.app",
  messagingSenderId: "833777613224",
  appId: "1:833777613224:web:d8de5ede931496809f859d",
  measurementId: "G-0TWCJT5NZJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services that you'll use
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// You don't necessarily need to export 'app' unless you have a specific use case for it.
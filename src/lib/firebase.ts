import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from 'firebase/auth';

// Log environment variables (without exposing actual values)
console.log('Firebase Config:', {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Set' : 'Not Set',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'Set' : 'Not Set',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'Set' : 'Not Set',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? 'Set' : 'Not Set',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? 'Set' : 'Not Set',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? 'Set' : 'Not Set',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ? 'Set' : 'Not Set'
});

const firebaseConfig = {
  apiKey: "AIzaSyAIJVEfT4HYC2RFn5kjNtyqwr7_3jqCZ_Y",
  authDomain: "klarparat-be2dd.firebaseapp.com",
  projectId: "klarparat-be2dd",
  storageBucket: "klarparat-be2dd.firebasestorage.app",
  messagingSenderId: "199683367893",
  appId: "1:199683367893:web:8626f8a6afb0ef46d3d35c",
  measurementId: "G-3J37MR3T6M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Initialize analytics only if supported
export const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null); 
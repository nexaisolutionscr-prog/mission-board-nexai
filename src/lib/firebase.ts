import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAHUr4ihWK3pXzfFY4rVT-Qmh5KFBWnXtA",
  authDomain: "mission-board-ca550.firebaseapp.com",
  projectId: "mission-board-ca550",
  storageBucket: "mission-board-ca550.firebasestorage.app",
  messagingSenderId: "349239625535",
  appId: "1:349239625535:web:afdbf42556410c8075758a",
  measurementId: "G-4C305XSF48"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };

// Pixar/config/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyADSJhSL-mUkh_HsHr6r0InrPxoxMo7QPU",
  authDomain: "wallpaper-c74a3.firebaseapp.com",
  projectId: "wallpaper-c74a3",
  storageBucket: "wallpaper-c74a3.appspot.com",
  messagingSenderId: "704605252889",
  appId: "1:704605252889:web:fd7d4f666da70d2aeda988",
  measurementId: "G-CL5K9HN0NL",
};

// ✅ Prevent duplicate initialization
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ✅ Initialize Auth with AsyncStorage persistence for React Native
// Check if auth is already initialized
let auth;
try {
  // Try to initialize with AsyncStorage persistence (first time)
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  // If already initialized, get the existing instance
  if (error.code === 'auth/already-initialized' || error.message?.includes('already initialized')) {
    auth = getAuth(app);
  } else {
    // For other errors, still try to get auth instance
    auth = getAuth(app);
  }
}

export { auth };
export const storage = getStorage(app);
export const db = getFirestore(app);
export { app };

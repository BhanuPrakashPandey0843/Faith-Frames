// Pixar\firebaseConfig.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyADSJhSL-mUkh_HsHr6r0InrPxoxMo7QPU",
  authDomain: "wallpaper-c74a3.firebaseapp.com",
  projectId: "wallpaper-c74a3",
  storageBucket: "wallpaper-c74a3.appspot.com",
  messagingSenderId: "704605252889",
  appId: "1:704605252889:web:fd7d4f666da70d2aeda988",
};

// ✅ Prevent re-initialization (important for Expo/React Native hot reloads)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ✅ Export Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;

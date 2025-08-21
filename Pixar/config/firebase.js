// Pixar\config\firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

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


const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);

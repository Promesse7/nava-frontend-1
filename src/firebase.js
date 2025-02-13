// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1H7C5MjMZpxZLDKDG0f1MR8O8U6gy5nY",
  authDomain: "nava-travel.firebaseapp.com",
  projectId: "nava-travel",
  storageBucket: "nava-travel.appspot.com",
  messagingSenderId: "342362740941",
  appId: "1:342362740941:web:be2a4129cb977675cbf184",
  measurementId: "G-YXW8F54VXH"
};

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;


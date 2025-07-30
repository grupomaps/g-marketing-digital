import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
  // apiKey: "AIzaSyAv14rERK5d3G9_qwN-YOOGslPnPcDwtG0",
  // authDomain: "test-e9567.firebaseapp.com",
  // projectId: "test-e9567",
  // storageBucket: "test-e9567.appspot.com",
  // messagingSenderId: "861061406484",
  // appId: "1:861061406484:web:626c360a227d0befd96c01",
  // measurementId: "G-XRE4YMX1GW"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);


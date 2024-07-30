// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_KEY,
  authDomain: "pantry-tracker-b865c.firebaseapp.com",
  projectId: "pantry-tracker-b865c",
  storageBucket: "pantry-tracker-b865c.appspot.com",
  messagingSenderId: "881051199556",
  appId: "1:881051199556:web:27fd0a55f06f2ac3acb411",
  measurementId: "G-P74S6R8LE6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);
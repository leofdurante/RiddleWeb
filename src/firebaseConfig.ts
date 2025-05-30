// src/firebaseConfig.ts

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB3GAvrVRutH2QyETU1STchABUDOTzfUGo",
  authDomain: "riddles-37ea5.firebaseapp.com",
  projectId: "riddles-37ea5",
  storageBucket: "riddles-37ea5.firebasestorage.app",
  messagingSenderId: "724765628582",
  appId: "1:724765628582:web:45d2952b1510ae765d7c67",
  measurementId: "G-YKVDC1VTVF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the app instance
export default app; 
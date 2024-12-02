// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCMBKxXccdJ4um2Q1Nwx_Nvm7ZqdMTgEB8",
  authDomain: "citefairly-4bd2f.firebaseapp.com",
  databaseURL: "https://citefairly-4bd2f-default-rtdb.firebaseio.com",
  projectId: "citefairly-4bd2f",
  storageBucket: "citefairly-4bd2f.firebasestorage.app",
  messagingSenderId: "739973377533",
  appId: "1:739973377533:web:059bbd196cea4b8e84bd94",
  measurementId: "G-NEQS8NLS68"
};

// Initialize Firebase
const cong = initializeApp(firebaseConfig);
const auth = getAuth(cong);

export { auth };

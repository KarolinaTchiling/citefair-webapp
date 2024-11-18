// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


// Your Firebase config here
const firebaseConfig = {
    apiKey: "AIzaSyD__4gUbhk0V8j4rLWL_gSJbFnp0KPndy0",
    authDomain: "citefairly.firebaseapp.com",
    databaseURL: "https://citefairly-default-rtdb.firebaseio.com",
    projectId: "citefairly",
    storageBucket: "citefairly.firebasestorage.app",
    messagingSenderId: "1012169974268",
    appId: "1:1012169974268:web:7874105990519e1d3a5279",
    measurementId: "G-4SHK8EGW9J"
  };

// Initialize Firebase
 const cong = initializeApp(firebaseConfig);

  export default cong;
// Now you can use Firebase services in your React app!
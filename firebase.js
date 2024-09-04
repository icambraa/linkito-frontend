// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAnA_wZY5PgSOTLP06t63N2so-tvTSP1J8",
  authDomain: "linkito-f0157.firebaseapp.com",
  projectId: "linkito-f0157",
  storageBucket: "linkito-f0157.appspot.com",
  messagingSenderId: "501925729392",
  appId: "1:501925729392:web:4a6ad82e8f3a148d4cd0b5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Set up the Google Auth provider
const provider = new GoogleAuthProvider();

// Function to handle Google Sign-In
const signInWithGoogle = () => {
  return signInWithPopup(auth, provider);
};

export { auth, signInWithGoogle };

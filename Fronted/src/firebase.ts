// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_KEY,
    authDomain: import.meta.env.VITE_AUTHDOMAIN_KEY,
    projectId: import.meta.env.VITE_PROJECTID_KEY,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET_KEY,
    messagingSenderId: import.meta.env.VITE_MESSAGEING_SENDER_ID_KEY,
    appId: import.meta.env.VITE_APPID_KEY,
    measurementId: import.meta.env.VITE_MEASURMENT_ID_KEY
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Configure Google Auth Provider
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

export { auth, googleProvider };
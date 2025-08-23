// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth , GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBxwYCZc3tEJYxiDZoVVu1pGeWV2mh1C1M",
  authDomain: "myproject-101ce.firebaseapp.com",
  projectId: "myproject-101ce",
  storageBucket: "myproject-101ce.firebasestorage.app",
  messagingSenderId: "201619113630",
  appId: "1:201619113630:web:9d8d693f02ce0cd7ff9d8f",
  measurementId: "G-7RCGHNBGNK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
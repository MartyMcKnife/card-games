// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAGN0fx9hJq68FlafZzWmdQEe22hWvqrn8",
  authDomain: "card-games-a5ee2.firebaseapp.com",
  projectId: "card-games-a5ee2",
  storageBucket: "card-games-a5ee2.appspot.com",
  messagingSenderId: "1061354132797",
  appId: "1:1061354132797:web:42dc4f40d401a3b456a154",
  measurementId: "G-LC5YCK3JZJ",
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();

export default app;

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC3K-IX-Gu04zvPUFvkRnC36pQLWId46OA",
  authDomain: "dgputt-e5c4f.firebaseapp.com",
  databaseURL: "https://dgputt-e5c4f.firebaseio.com",
  projectId: "dgputt-e5c4f",
  storageBucket: "dgputt-e5c4f.appspot.com",
  messagingSenderId: "170234921873",
  appId: "1:170234921873:web:8ba49acdd4b7fc60359030",
  measurementId: "G-7LLY0VMEV6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

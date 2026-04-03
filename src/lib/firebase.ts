import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

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

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getDatabase(app);

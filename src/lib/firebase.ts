import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Missing required Firebase environment variable: ${name}. ` +
        "Set it in your environment before initializing Firebase.",
    );
  }

  return value;
}

const firebaseConfig = {
  apiKey: getRequiredEnv("NEXT_PUBLIC_FIREBASE_API_KEY"),
  authDomain: getRequiredEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
  databaseURL: getRequiredEnv("NEXT_PUBLIC_FIREBASE_DATABASE_URL"),
  projectId: getRequiredEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
  storageBucket: getRequiredEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: getRequiredEnv("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
  appId: getRequiredEnv("NEXT_PUBLIC_FIREBASE_APP_ID"),
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

function getFirebaseApp() {
  return getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
}

export function getFirebaseAuth() {
  return getAuth(getFirebaseApp());
}

export function getFirebaseDb() {
  return getDatabase(getFirebaseApp());
}

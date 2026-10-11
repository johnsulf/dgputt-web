import {
  initializeApp,
  getApps,
  getApp,
  type FirebaseOptions,
} from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

function getFirebaseApp() {
  // Look up the default (prod) app by name: the dev app may exist too.
  if (getApps().some((app) => app.name === "[DEFAULT]")) return getApp();

  return initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  });
}

export function getFirebaseAuth() {
  return getAuth(getFirebaseApp());
}

// Super admins can read league data from the dev project instead of prod.
// The dev project (dgputt-dev) is a separate Firebase project with its own
// sign-ins, so it gets its own named app. Its config comes from the
// NEXT_PUBLIC_FIREBASE_DEV_* variables; without them the switch is hidden.

export type DataSource = "prod" | "dev";

const DEV_APP_NAME = "dev";
const DATA_SOURCE_KEY = "dgputt.dataSource";

function devConfig(): FirebaseOptions | null {
  const config: FirebaseOptions = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_DEV_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_DEV_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DEV_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_DEV_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_DEV_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_DEV_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_DEV_APP_ID,
  };
  return config.apiKey && config.projectId && config.databaseURL
    ? config
    : null;
}

/** Whether the dev project is configured for this build. */
export function isDevAvailable(): boolean {
  return devConfig() !== null;
}

function getDevApp() {
  const existing = getApps().find((app) => app.name === DEV_APP_NAME);
  if (existing) return existing;
  const config = devConfig();
  if (!config) throw new Error("Dev Firebase project is not configured");
  return initializeApp(config, DEV_APP_NAME);
}

export function getDevAuth() {
  return getAuth(getDevApp());
}

/** The database league data is read from, as chosen in this browser. */
export function getDataSource(): DataSource {
  if (typeof window === "undefined" || !isDevAvailable()) return "prod";
  try {
    return window.localStorage.getItem(DATA_SOURCE_KEY) === "dev"
      ? "dev"
      : "prod";
  } catch {
    return "prod";
  }
}

export function setDataSource(source: DataSource) {
  try {
    if (source === "dev") window.localStorage.setItem(DATA_SOURCE_KEY, "dev");
    else window.localStorage.removeItem(DATA_SOURCE_KEY);
  } catch {
    // Storage can be blocked; the choice then lasts until reload only.
  }
}

/** League data: the prod database, or dev when a super admin chose it. */
export function getFirebaseDb() {
  return getDataSource() === "dev"
    ? getDatabase(getDevApp())
    : getDatabase(getFirebaseApp());
}

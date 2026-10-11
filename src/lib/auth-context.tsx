"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import {
  getDataSource,
  getDevAuth,
  getFirebaseAuth,
  isDevAvailable,
  setDataSource,
  type DataSource,
} from "@/lib/firebase";
import { isSuperAdmin } from "@/lib/super-admin";

interface AuthContextType {
  /** The signed-in prod account; it decides who may see what. */
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;

  /** Which database league data comes from. */
  dataSource: DataSource;
  /** Super admin with the dev project configured: may switch databases. */
  canSwitchDataSource: boolean;
  /** Switches database and reloads, so no page mixes data from both. */
  switchDataSource: (source: DataSource) => void;
  /** Account signed in to the dev project (dev mode only). */
  devUser: User | null;
  signInDev: (email: string, password: string) => Promise<void>;
  /**
   * The user id in the database being viewed, for league admin checks and
   * favourites. Dev and prod accounts have different ids.
   */
  dataUid: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const noSubscribe = () => () => {};

function reload() {
  window.location.reload();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [devUser, setDevUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [devLoading, setDevLoading] = useState(true);
  // Read from browser storage after hydration; the server always renders
  // prod. The choice only changes with a reload, so nothing to subscribe to.
  const dataSource = useSyncExternalStore<DataSource>(
    noSubscribe,
    getDataSource,
    () => "prod",
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), (user) => {
      // Only super admins may stay on dev data.
      if (getDataSource() === "dev" && !isSuperAdmin(user?.uid)) {
        setDataSource("prod");
        reload();
        return;
      }
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (dataSource !== "dev") return;
    return onAuthStateChanged(getDevAuth(), (devUser) => {
      setDevUser(devUser);
      setDevLoading(false);
    });
  }, [dataSource]);

  async function signIn(email: string, password: string) {
    await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
  }

  async function signOut() {
    if (dataSource === "dev") {
      setDataSource("prod");
      await firebaseSignOut(getDevAuth());
    }
    await firebaseSignOut(getFirebaseAuth());
  }

  function switchDataSource(source: DataSource) {
    if (source === dataSource) return;
    setDataSource(source);
    reload();
  }

  async function signInDev(email: string, password: string) {
    await signInWithEmailAndPassword(getDevAuth(), email, password);
    // Pages loaded before the dev sign-in could not read dev data.
    reload();
  }

  const isDev = dataSource === "dev";

  return (
    <AuthContext.Provider
      value={{
        user,
        // In dev mode, wait for the dev sign-in too before pages load data.
        loading: loading || (isDev && devLoading),
        signIn,
        signOut,
        dataSource,
        canSwitchDataSource: isDevAvailable() && isSuperAdmin(user?.uid),
        switchDataSource,
        devUser,
        signInDev,
        dataUid: isDev ? (devUser?.uid ?? null) : (user?.uid ?? null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

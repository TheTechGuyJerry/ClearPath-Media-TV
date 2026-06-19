import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { 
  getFirestore, 
  initializeFirestore,
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot 
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

// Support external environment variable overrides alongside the json config
const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfig.apiKey;
const AUTH_DOMAIN = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfig.authDomain;
const PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseConfig.projectId;
const STORAGE_BUCKET = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfig.storageBucket;
const MESSAGING_SENDER_ID = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfig.messagingSenderId;
const APP_ID = import.meta.env.VITE_FIREBASE_APP_ID || firebaseConfig.appId;
const FIRESTORE_DATABASE_ID = import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || firebaseConfig.firestoreDatabaseId;
const MEASUREMENT_ID = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || firebaseConfig.measurementId;

interface FirebaseConfigType {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export const resolvedConfig: FirebaseConfigType = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID
};

// Only append measurementId if it is explicitly provided (Google Analytics are optional)
if (MEASUREMENT_ID) {
  resolvedConfig.measurementId = MEASUREMENT_ID;
}

const app = initializeApp(resolvedConfig);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, FIRESTORE_DATABASE_ID || undefined); /* CRITICAL */
export const auth = getAuth(app);
export const storage = getStorage(app);

// Initialize Firebase Analytics if measurementId is a real one starting with "G-"
if (MEASUREMENT_ID && MEASUREMENT_ID.startsWith('G-')) {
  isSupported().then((supported) => {
    if (supported) {
      getAnalytics(app);
    }
  }).catch((err) => {
    console.warn('Analytics initialization failed: ', err);
  });
}

// Operational types for Firestore error debugging
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error Details: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

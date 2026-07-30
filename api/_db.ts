import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, addDoc, updateDoc, doc, limit } from 'firebase/firestore';
import config from '../firebase-applet-config.json';

// Initialize Firebase App for server environment
const firebaseApp = getApps().length === 0 ? initializeApp({
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId,
}) : getApp();

export const db = getFirestore(firebaseApp, config.firestoreDatabaseId || 'default');
export { collection, query, where, getDocs, addDoc, updateDoc, doc, limit };

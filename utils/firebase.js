import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAjLgh_4W2cll4zPHDX-pmVkQxyTTNToWY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "nextjs-giphy-app.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "nextjs-giphy-app", 
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:986654822886:web:e844237a315bb721e58627"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
export { db, auth };

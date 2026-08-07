// Firebase web SDK init (client-side). Config values are public identifiers, not
// secrets. Prod (ctbs-prod) is the baked default; a dev build can override via
// NEXT_PUBLIC_FIREBASE_* build args.
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "AIzaSyBJwxlRY6gYFQBdqv1k1BIeQAu7U6m6IG0",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "ctbs-prod.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "ctbs-prod",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "ctbs-prod.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "757021936514",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "1:757021936514:web:2bcc136a7107a90b805d9b",
};

export function getFirebaseAuth(): Auth {
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return getAuth(app);
}

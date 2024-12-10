'use client'

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD92aomIMmHRJS4DMN9D6-f0bFvh-UQA-8",
  authDomain: "taskado-4a17d.firebaseapp.com",
  projectId: "taskado-4a17d",
  storageBucket: "taskado-4a17d.firebasestorage.app",
  messagingSenderId: "962014219837",
  appId: "1:962014219837:web:75af56be58bb77f646a454",
  measurementId: "G-0CYPDDZ419"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Remove analytics for now as it's not needed for auth
// const analytics = getAnalytics(app); 
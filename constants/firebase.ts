import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyBvP7ggFVlcm4r4IarEuKR5jQTQXT_sNXc",
  authDomain: "healthcamp-8cef2.firebaseapp.com",
  projectId: "healthcamp-8cef2",
  storageBucket: "healthcamp-8cef2.appspot.com",
  messagingSenderId: "423302573314",
  appId: "1:423302573314:android:23c41de15aba38cb4de61bs"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
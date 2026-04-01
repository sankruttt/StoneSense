import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
// Replace with your actual Firebase config from Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyDLczZpkk7KL38OLMwN63_VcjCORn3CD7Q",
    authDomain: "stonesense-93a14.firebaseapp.com",
    projectId: "stonesense-93a14",
    storageBucket: "stonesense-93a14.firebasestorage.app",
    messagingSenderId: "375330200156",
    appId: "1:375330200156:web:100a1f4eca699f7612e499",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore
export const db = getFirestore(app);

export default app;

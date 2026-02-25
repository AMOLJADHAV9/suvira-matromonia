// Firebase Configuration
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAnalytics } from 'firebase/analytics'
import { getFunctions } from 'firebase/functions'

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDoCeMAElWXY3G8uVllOxRCRbfmk0Xqr7E",
  authDomain: "suvira-firebase-react.firebaseapp.com",
  projectId: "suvira-firebase-react",
  storageBucket: "suvira-firebase-react.firebasestorage.app",
  messagingSenderId: "4301391515",
  appId: "1:4301391515:web:2aa028d027738b69fd283e",
  measurementId: "G-VS8FN13R5R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export { app }

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const functions = getFunctions(app)

// Initialize Analytics (only in browser environment)
let analytics = null
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app)
}
export { analytics }

export default app
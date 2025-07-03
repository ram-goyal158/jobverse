import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDPzOUQ4SGs1lg1Fl8kyNpzuRSLlryGrmE",
  authDomain: "jobverse-6fadc.firebaseapp.com",
  projectId: "jobverse-6fadc",
  storageBucket: "jobverse-6fadc.firebasestorage.app",
  messagingSenderId: "629421733545",
  appId: "1:629421733545:web:5a126c4e580a0e832b1bb8",
  measurementId: "G-2KSFSH1JMC" // optional
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// ✅ Export services to use in project
export const auth = getAuth(app)
export const db = getFirestore(app)

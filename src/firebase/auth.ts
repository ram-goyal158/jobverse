import { auth } from './config'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'

// 🔹 Email/Password Signup
export const signUpWithEmail = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password)
}

// 🔹 Email/Password Login
export const loginWithEmail = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password)
}

// 🔹 Google Auth
const provider = new GoogleAuthProvider()
export const signInWithGoogle = () => {
  return signInWithPopup(auth, provider)
}

// 🔹 Logout
export const logout = () => {
  return signOut(auth)
}

// 🔹 Auth Listener
export const onAuthChange = (callback: (user: any) => void) => {
  return onAuthStateChanged(auth, callback)
}

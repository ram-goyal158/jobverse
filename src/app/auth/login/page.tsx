'use client'

import { useState } from 'react'
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import { auth } from '@/firebase/config'
import { db } from '@/firebase/config'
import { useRouter } from 'next/navigation'
import { FcGoogle } from 'react-icons/fc'
import { motion } from 'framer-motion'
import { doc, setDoc } from 'firebase/firestore'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/dashboard/seeker') // Later: check role dynamically
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      // ✅ Save user to Firestore
      const userRef = doc(db, 'users', user.uid)
      await setDoc(
        userRef,
        {
          uid: user.uid,
          email: user.email,
          role: 'user', // Default role, can be changed to 'seeker' or 'employer'
          createdAt: new Date().toISOString()
        },
        { merge: true }
      )

      router.push('/dashboard/seeker') // TODO: Redirect based on role
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gray-100 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login to JobVerse</h2>

        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <div className="flex items-center gap-2 mt-6 mb-2">
          <div className="h-px flex-1 bg-gray-300" />
          <span className="text-gray-400 text-sm">OR</span>
          <div className="h-px flex-1 bg-gray-300" />
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 border py-2 rounded hover:bg-gray-100 transition"
        >
          <FcGoogle className="text-xl" /> Continue with Google
        </button>

        <p className="text-center mt-4 text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <a href="/auth/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </motion.div>
  )
}

'use client'

import { useState } from 'react'
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth, db } from '@/firebase/config'
import { doc, setDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { FcGoogle } from 'react-icons/fc'
import { motion } from 'framer-motion'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('seeker') // seeker or employer
  const [error, setError] = useState('')
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password)

      // Store user with role in Firestore
      await setDoc(doc(db, 'users', res.user.uid), {
        uid: res.user.uid,
        email: res.user.email,
        role: role,
        createdAt: new Date(),
      })

      router.push(`/dashboard/${role}`)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleGoogleRegister = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const res = await signInWithPopup(auth, provider)

      // Default role on Google Signup = seeker
      await setDoc(doc(db, 'users', res.user.uid), {
        uid: res.user.uid,
        email: res.user.email,
        role: 'seeker',
        createdAt: new Date(),
      })

      router.push('/dashboard/seeker')
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
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create an Account</h2>

        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
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

          {/* 🔘 Role Selection */}
          <div className="flex gap-4 items-center justify-between">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="seeker"
                checked={role === 'seeker'}
                onChange={() => setRole('seeker')}
              />
              Job Seeker
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="employer"
                checked={role === 'employer'}
                onChange={() => setRole('employer')}
              />
              Employer
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>

        <div className="flex items-center gap-2 mt-6 mb-2">
          <div className="h-px flex-1 bg-gray-300" />
          <span className="text-gray-400 text-sm">OR</span>
          <div className="h-px flex-1 bg-gray-300" />
        </div>

        <button
          onClick={handleGoogleRegister}
          className="w-full flex items-center justify-center gap-2 border py-2 rounded hover:bg-gray-100 transition"
        >
          <FcGoogle className="text-xl" /> Continue with Google
        </button>

        <p className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/auth/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </motion.div>
  )
}

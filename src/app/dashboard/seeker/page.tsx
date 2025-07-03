'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/firebase/config'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { motion } from 'framer-motion'

export default function SeekerDashboard() {
  const [userData, setUserData] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/auth/login')
      } else {
        const docRef = doc(db, 'users', user.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists() && docSnap.data().role === 'seeker') {
          setUserData({ uid: user.uid, ...docSnap.data() })
        } else {
          router.push('/')
        }
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <motion.div
      className="min-h-screen px-6 py-12 bg-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome, Job Seeker 👋</h1>

        {!userData ? (
          <p className="text-sm text-gray-400">Loading user data...</p>
        ) : (
          <div className="space-y-3">
            <p className="text-gray-700"><strong>Email:</strong> {userData.email}</p>
            <p className="text-gray-700"><strong>UID:</strong> {userData.uid}</p>
            <p className="text-gray-700"><strong>Role:</strong> {userData.role}</p>
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 p-4 rounded-lg text-blue-800">
          🎯 Start applying to jobs now! Visit the{' '}
          <a href="/jobs" className="underline font-medium">Jobs Page</a>
        </div>
      </div>
    </motion.div>
  )
}

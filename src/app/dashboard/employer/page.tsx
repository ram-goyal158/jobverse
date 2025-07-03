'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/firebase/config'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { motion } from 'framer-motion'

export default function EmployerDashboard() {
  const [userData, setUserData] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/auth/login')
      } else {
        const docRef = doc(db, 'users', user.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists() && docSnap.data().role === 'employer') {
          setUserData(docSnap.data())
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
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome, Employer 👔</h1>

        {userData ? (
          <p className="text-gray-600 mb-6">
            Logged in as: <strong>{userData.email}</strong>
          </p>
        ) : (
          <p className="text-sm text-gray-400">Loading user data...</p>
        )}

        <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-green-800">
          📢 Ready to post a job?{' '}
          <a
            href="/dashboard/employer/post-job"
            className="underline font-medium text-green-700 hover:text-green-900"
          >
            Click here to Post a Job
          </a>
        </div>

        {/* 🔜 Future: Posted job list, applicants section, edit job option */}
      </div>
    </motion.div>
  )
}

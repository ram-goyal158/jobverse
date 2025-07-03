'use client'

import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '@/firebase/config'
import { collection, deleteDoc, doc, getDoc, getDocs } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function AdminJobsPage() {
  const [user, setUser] = useState<any>(null)
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  // 🔐 Auth + Role check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/auth/login')
      } else {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists() && userDoc.data().role === 'admin') {
          setUser({ ...userDoc.data(), uid: user.uid })
        } else {
          router.push('/')
        }
      }
    })

    return () => unsubscribe()
  }, [])

  // 📦 Fetch jobs from Firestore
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'jobs'))
        const jobsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setJobs(jobsData)
      } catch (err) {
        console.error(err)
        setError('Failed to fetch jobs')
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'jobs', id))
      setJobs(prev => prev.filter(job => job.id !== id))
    } catch (err) {
      console.error(err)
      setError('Failed to delete job')
    }
  }

  if (loading) return <p className="p-6">Loading...</p>

  return (
    <motion.div
      className="min-h-screen px-6 py-12 bg-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">🧾 All Posted Jobs</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {jobs.length === 0 ? (
          <p>No jobs found.</p>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="border p-4 rounded flex justify-between items-start gap-4"
              >
                <div>
                  <h2 className="text-lg font-semibold">{job.title}</h2>
                  <p className="text-sm text-gray-600">{job.company} · {job.location}</p>
                  <p className="text-xs text-gray-400 mt-1">{job.type}</p>
                </div>

                <button
                  onClick={() => handleDelete(job.id)}
                  className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

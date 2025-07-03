'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { auth, db } from '@/firebase/config'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { motion } from 'framer-motion'

export default function ApplyPage() {
  const { jobId } = useParams()
  const router = useRouter()
  const [job, setJob] = useState<any>(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // 🔐 Check auth + role
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/auth/login')
      } else {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists() && userDoc.data().role === 'seeker') {
          setUser({ ...userDoc.data(), uid: user.uid })
        } else {
          router.push('/')
        }
      }
    })

    return () => unsubscribe()
  }, [])

  // 🔍 Fetch job detail
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const docRef = doc(db, 'jobs', jobId as string)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setJob(docSnap.data())
        }
      } catch (err) {
        console.error('Error fetching job:', err)
      } finally {
        setLoading(false)
      }
    }

    if (jobId) fetchJob()
  }, [jobId])

  // 📤 Handle Application
  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await addDoc(collection(db, 'applications'), {
        jobId,
        jobTitle: job?.title || '',
        applicantId: user.uid,
        applicantEmail: user.email,
        message,
        createdAt: serverTimestamp(),
      })

      setSuccess(true)
    } catch (err: any) {
      setError('Failed to submit application')
      console.error(err)
    }
  }

  if (loading) return <p className="p-4">Loading...</p>
  if (!job) return <p className="p-4 text-red-600">Job not found.</p>

  return (
    <motion.div
      className="min-h-screen px-6 py-12 bg-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Apply for {job.title}</h1>
        <p className="text-gray-600 mb-4">{job.company}</p>

        {success ? (
          <p className="text-green-600 font-semibold">✅ Application submitted successfully!</p>
        ) : (
          <form onSubmit={handleApply} className="space-y-4">
            <textarea
              placeholder="Write a short message or cover letter..."
              className="w-full p-4 border rounded"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Submit Application
            </button>
          </form>
        )}
      </div>
    </motion.div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { motion } from 'framer-motion'

export default function JobDetailPage() {
  const { jobId } = useParams()
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const docRef = doc(db, 'jobs', jobId as string)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setJob(docSnap.data())
        }
      } catch (error) {
        console.error('Error fetching job:', error)
      } finally {
        setLoading(false)
      }
    }

    if (jobId) fetchJob()
  }, [jobId])

  if (loading) return <p className="p-4">Loading...</p>
  if (!job) return <p className="p-4">Job not found.</p>

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen px-6 py-12 max-w-4xl mx-auto bg-gray-50"
    >
      <div className="bg-white p-6 rounded shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{job.title}</h1>
        <p className="text-gray-600 text-sm">{job.company}</p>
        <p className="text-gray-500 text-sm mb-4">{job.location} • {job.type}</p>

        <p className="text-green-600 font-medium mb-6">Salary: {job.salary}</p>

        <h3 className="font-semibold mb-1">Job Description</h3>
        <p className="text-gray-700 mb-6 whitespace-pre-line">{job.description || 'No description available.'}</p>

        <button
          onClick={() => router.push(`/apply/${jobId}`)}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Apply Now
        </button>
      </div>
    </motion.div>
  )
}

'use client'

import { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase/config'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, DollarSign, Building, Frown } from 'lucide-react'

export default function JobsPageContent() {
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const searchParams = useSearchParams()

  useEffect(() => {
    const queryFromUrl = searchParams.get('search')?.toLowerCase() || ''
    setSearchTerm(queryFromUrl)
  }, [searchParams])

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true)
      try {
        const snapshot = await getDocs(collection(db, 'jobs'))
        const jobList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setTimeout(() => {
          setJobs(jobList)
          setLoading(false)
        }, 800)
      } catch (error) {
        console.error('Error fetching jobs:', error)
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  const filteredJobs = useMemo(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase()
    if (!lowercasedSearchTerm) return jobs
    return jobs.filter(job =>
      job.title?.toLowerCase().includes(lowercasedSearchTerm) ||
      job.company?.toLowerCase().includes(lowercasedSearchTerm) ||
      job.location?.toLowerCase().includes(lowercasedSearchTerm) ||
      job.category?.toLowerCase().includes(lowercasedSearchTerm)
    )
  }, [searchTerm, jobs])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Find Your <span className="text-blue-900">Dream Job</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
            Explore thousands of job opportunities with all the information you need.
          </p>
          <div className="mt-8 max-w-xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Job title, keyword, or company"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm"
              />
            </div>
          </div>
        </motion.div>

        {loading ? (
          <SkeletonGrid />
        ) : (
          <AnimatePresence>
            {filteredJobs.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredJobs.map(job => (
                  <JobCard key={job.id} job={job} variants={itemVariants} />
                ))}
              </motion.div>
            ) : (
              <NoJobsFound />
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

// JobCard component
const JobCard = ({ job, variants }: { job: any, variants: any }) => (
  <motion.div
    variants={variants}
    whileHover={{ scale: 1.03, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)" }}
    className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col shadow-sm hover:shadow-lg transition-shadow duration-300"
  >
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <Building className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
          <p className="text-sm text-gray-600">{job.company}</p>
        </div>
      </div>
      {job.type && (
         <span className="bg-blue-100 text-blue-900 text-xs font-semibold px-2.5 py-1 rounded-full">
            {job.type}
         </span>
      )}
    </div>
    
    <div className="mt-4 space-y-2 text-sm text-gray-500">
        <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            <span>{job.location}</span>
        </div>
        {job.salary && (
            <div className="flex items-center text-green-600 font-semibold">
                <DollarSign className="w-4 h-4 mr-2" />
                <span>{job.salary}</span>
            </div>
        )}
    </div>

    <div className="mt-6 flex-grow flex items-end">
      <Link
        href={/jobs/${job.slug || job.id}}
        className="w-full text-center bg-blue-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
      >
        View Details
      </Link>
    </div>
  </motion.div>
)

// Skeleton Loader Component
const SkeletonGrid = () => {
  const skeletonVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      variants={skeletonVariants}
      initial="hidden"
      animate="visible"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div key={i} variants={itemVariants} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="animate-pulse flex flex-col h-full">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="mt-6 flex-grow flex items-end">
              <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

// No Jobs Found Component
const NoJobsFound = () => (
  <motion.div
    className="text-center py-16"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
  >
    <Frown className="mx-auto h-16 w-16 text-gray-400" />
    <h3 className="mt-2 text-xl font-semibold text-gray-900">No Jobs Found</h3>
    <p className="mt-1 text-gray-500">
      Sorry, we couldn't find any jobs matching your search. Try different keywords.
    </p>
  </motion.div>
)

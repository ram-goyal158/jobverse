// ✅ src/app/dashboard/page.tsx (for normal user) - IMPROVED UI

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Loader2, User, FileText, Bookmark, Search, Edit } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

// Dummy data, aap ise baad mein API se fetch kar sakte hain
const dashboardStats = {
  appliedJobs: 7,
  savedJobs: 3,
  profileCompleteness: 75, // percentage
}

export default function UserDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect to login if not authenticated after loading is complete
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  // Loading State
  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
      </div>
    )
  }

  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {(user as any).name || user.email?.split('@')[0]}!
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Here's your job search summary. Let's find your next opportunity.
          </p>
        </motion.div>

        {/* Dashboard Cards Grid */}
        <motion.div
          className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="visible"
        >
          {/* Profile Completeness Card */}
          <motion.div custom={0} variants={cardVariants} className="overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg transform hover:-translate-y-1 transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-md bg-indigo-500 p-3">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4 w-0 flex-1">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Profile</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Completeness</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-300">
                        {dashboardStats.profileCompleteness}% Complete
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200 dark:bg-gray-700">
                    <div style={{ width: `${dashboardStats.profileCompleteness}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"></div>
                  </div>
                </div>
                <Link href="/profile" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                  Update Profile →
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Applied Jobs Card */}
          <motion.div custom={1} variants={cardVariants} className="flex flex-col justify-between overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg transform hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start">
                  <div className="flex-shrink-0 rounded-md bg-green-500 p-3">
                      <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Applied Jobs</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{dashboardStats.appliedJobs}</p>
                  </div>
              </div>
              <Link href="/dashboard/applications" className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                  View All Applications →
              </Link>
          </motion.div>

          {/* Saved Jobs Card */}
          <motion.div custom={2} variants={cardVariants} className="flex flex-col justify-between overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg transform hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start">
                  <div className="flex-shrink-0 rounded-md bg-yellow-500 p-3">
                      <Bookmark className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Saved Jobs</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{dashboardStats.savedJobs}</p>
                  </div>
              </div>
              <Link href="/dashboard/saved-jobs" className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                  View Saved Jobs →
              </Link>
          </motion.div>
        </motion.div>
        
        {/* Quick Actions Section */}
        <motion.div 
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Get Started</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link href="/jobs" className="flex items-center justify-center gap-3 rounded-lg bg-indigo-600 px-6 py-4 text-lg font-semibold text-white shadow-md hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105">
              <Search className="h-6 w-6" />
              Find New Jobs
            </Link>
            <Link href="/profile" className="flex items-center justify-center gap-3 rounded-lg bg-gray-200 px-6 py-4 text-lg font-semibold text-gray-800 shadow-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-105">
              <Edit className="h-6 w-6" />
              Edit Your Profile
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

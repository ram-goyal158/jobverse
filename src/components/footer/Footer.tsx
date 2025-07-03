'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { auth, db } from '@/firebase/config'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

export default function Footer() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
        if (userDoc.exists()) {
          setUser({ ...userDoc.data(), uid: currentUser.uid })
        }
      } else {
        setUser(null)
      }
    })

    return () => unsubscribe()
  }, [])

  // 🔁 Role-based dashboard path
  const dashboardLink = user
    ? user.role === 'seeker'
      ? '/dashboard/seeker'
      : user.role === 'employer'
        ? '/dashboard/employer'
        : '/dashboard/admin'
    : '/auth/login'

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-t">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-6">
        
        {/* 🔹 Branding */}
        <div>
          <h2 className="text-xl font-bold text-blue-900">JobVerse</h2>
          <p className="text-sm mt-2">Find your dream job. Fast and easy.</p>
        </div>

        {/* 🔹 Links */}
        <div>
          <h3 className="text-md font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li><Link href="/jobs" className="hover:underline">Browse Jobs</Link></li>
            <li><Link href="/dashboard/employer/post-job" className="hover:underline">Post a Job</Link></li>
            <li><Link href={dashboardLink} className="hover:underline">Dashboard</Link></li>
          </ul>
        </div>

        {/* 🔹 Contact */}
        <div>
          <h3 className="text-md font-semibold mb-2">Contact</h3>
          <p className="text-sm">Email: <a href="mailto:support@jobverse.com" className="underline">support@jobverse.com</a></p>
          <p className="text-sm mt-1">Made with Ram Goyal</p>
        </div>
      </div>

      <div className="bg-gray-200 dark:bg-gray-800 text-center text-xs py-4">
        &copy; {new Date().getFullYear()} JobVerse. All rights reserved.
      </div>
    </footer>
  )
}

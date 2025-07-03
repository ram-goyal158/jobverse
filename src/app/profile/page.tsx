'use client'

import { useEffect, useState } from 'react'
import { auth, db } from '@/firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { Loader2, Mail, ShieldCheck, LogOut } from 'lucide-react' // Import icons

export default function ProfilePage() {
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setUserData(docSnap.data())
        } else {
          // User is authenticated but no profile data found
          console.error("No profile data found for user:", user.uid);
          router.push('/')
        }
      } else {
        // No user is logged in
        router.push('/login')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router]) // Add router to dependency array

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.push('/login')
    } catch (error) {
      console.error('Error signing out: ', error)
    }
  }

  // Loading State UI
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-12 w-12 animate-spin text-blue-900" />
        <p className="ml-4 text-lg text-slate-700">Loading Profile...</p>
      </div>
    )
  }
  
  // Render nothing if user data is not yet available but loading is false
  // This prevents a flash of an empty page before redirection happens
  if (!userData) {
      return null; 
  }

  // Profile Card UI
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        
        <div className="flex flex-col items-center">
          {/* Avatar */}
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-blue-900 text-4xl font-bold mb-4">
            {userData?.email?.charAt(0).toUpperCase()}
          </div>
          
          {/* User Email */}
          <h1 className="text-2xl font-bold text-slate-800">{userData?.email}</h1>
          
          {/* Role Badge */}
          <div className="mt-2 inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-900">
            <ShieldCheck className="mr-2 h-4 w-4" />
            {userData?.role}
          </div>
        </div>

        <div className="my-8 border-t border-slate-200"></div>

        {/* Details Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-blue-900">User Details</h2>
          <div className="flex items-center text-slate-600">
            <Mail className="mr-3 h-5 w-5" />
            <span className="font-medium">Email:</span>
            <span className="ml-2">{userData?.email}</span>
          </div>
          <div className="flex items-center text-slate-600">
            <ShieldCheck className="mr-3 h-5 w-5" />
            <span className="font-medium">Role:</span>
            <span className="ml-2">{userData?.role}</span>
          </div>
        </div>

        <div className="my-8 border-t border-slate-200"></div>
        
        {/* Action Button */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center rounded-lg bg-blue-800 px-4 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <LogOut className="mr-2 h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  )
}

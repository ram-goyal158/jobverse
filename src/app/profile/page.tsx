'use client'

import { useEffect, useState } from 'react'
import { auth, db } from '@/firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/navigation'

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
          router.push('/')
        }
      } else {
        router.push('/login')
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) return <p className="p-6">Loading profile...</p>

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4 text-purple-700">Your Profile</h1>
      <p><span className="font-semibold">Email:</span> {userData?.email}</p>
      <p className="mt-2"><span className="font-semibold">Role:</span> {userData?.role}</p>
    </div>
  )
}

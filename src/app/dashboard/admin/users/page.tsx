'use client'

import { useEffect, useState } from 'react'
import { auth, db } from '@/firebase/config'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { collection, doc, getDoc, getDocs, deleteDoc } from 'firebase/firestore'
import { motion } from 'framer-motion'

export default function AdminUsersPage() {
  const [user, setUser] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  // 🔐 Auth + Role Check
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

  // 🔍 Get all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'users'))
        const userList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setUsers(userList)
      } catch (err) {
        console.error(err)
        setError('Failed to fetch users')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'users', id))
      setUsers(prev => prev.filter(u => u.id !== id))
    } catch (err) {
      console.error(err)
      setError('Failed to delete user')
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
        <h1 className="text-2xl font-bold mb-4">👥 All Registered Users</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <div className="space-y-3">
            {users.map((u) => (
              <div key={u.id} className="border p-4 rounded flex justify-between items-center">
                <div>
                  <h2 className="text-md font-semibold">{u.name || 'Unnamed User'}</h2>
                  <p className="text-sm text-gray-700">{u.email}</p>
                  <p className="text-xs text-gray-500">Role: {u.role}</p>
                </div>

                <button
                  onClick={() => handleDelete(u.id)}
                  className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
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

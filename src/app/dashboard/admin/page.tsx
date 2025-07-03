'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Loader2 } from 'lucide-react'

export default function AdminDashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    } else if (!loading && user?.role !== 'admin') {
      router.push('/')
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (user.role !== 'admin') {
    return (
      <div className="p-6 text-center">
        <p>You don't have permission to access this page</p>
      </div>
    )
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">Admin Dashboard</h1>
      <p>Welcome, <span className="font-semibold">{user.email}</span></p>
      <p className="mt-2 text-gray-500">Role: {user.role}</p>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Users</h3>
          <p>Manage all users</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Jobs</h3>
          <p>Manage all job postings</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Reports</h3>
          <p>View system reports</p>
        </div>
      </div>
    </div>
  )
}
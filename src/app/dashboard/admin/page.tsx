// app/dashboard/admin/page.tsx

'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Loader2, Users, Briefcase, BarChart } from 'lucide-react'

// TypeScript ke liye Card props ka type define karte hain
interface DashboardCardProps {
  icon: React.ReactNode;
  title: string;
  count: string;
  description: string;
}

// Card Component for Dashboard widgets
const DashboardCard: React.FC<DashboardCardProps> = ({ icon, title, count, description }) => {
  return (
    <div className="transform rounded-xl border border-slate-200 bg-white p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold uppercase text-slate-500">{title}</h3>
          <p className="text-3xl font-bold text-slate-800">{count}</p>
          <p className="text-sm text-slate-400">{description}</p>
        </div>
        <div className="rounded-lg bg-blue-100 p-3 text-blue-800">
          {icon}
        </div>
      </div>
    </div>
  )
}

// Main Admin Dashboard Page Component
export default function AdminDashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Agar user login nahi hai to login page par bhejo
        router.push('/auth/login')
      } else if (user.role !== 'admin') {
        // Agar user admin nahi hai to home page par bhejo
        router.push('/')
      }
    }
  }, [user, loading, router])

  // Jab tak loading ho rahi hai ya user data nahi hai, ya user admin nahi hai,
  // tab tak loader dikhao jab tak redirect na ho jaye.
  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-12 w-12 animate-spin text-blue-900" />
      </div>
    )
  }

  // Ab hamara main dashboard UI
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="p-6 sm:p-10">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-900">Admin Dashboard</h1>
          <p className="mt-2 text-slate-600">
            Welcome back, <span className="font-semibold text-slate-800">{user.email}</span>. Here's what's happening.
          </p>
        </div>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            title="Total Users"
            count="1,250"
            description="All registered users"
            icon={<Users className="h-6 w-6" />}
          />
          <DashboardCard
            title="Active Jobs"
            count="75"
            description="Currently open positions"
            icon={<Briefcase className="h-6 w-6" />}
          />
          <DashboardCard
            title="Reports"
            count="Analytics"
            description="System & user reports"
            icon={<BarChart className="h-6 w-6" />}
          />
        </div>

        {/* Future Content Area */}
        <div className="mt-10 rounded-lg bg-white p-6 shadow-md">
           <h2 className="text-2xl font-semibold text-blue-900">Recent Activity</h2>
           <p className="mt-2 text-slate-500">Activity feed will be displayed here...</p>
        </div>
      </main>
    </div>
  )
}
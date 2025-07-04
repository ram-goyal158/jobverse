'use client'

import dynamic from 'next/dynamic'

// Dynamically import the JobsPageContent component with SSR disabled
const JobsPageContent = dynamic(() => import('@/components/JobsPageContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center text-gray-500">
      Loading jobs...
    </div>
  )
})

export default function JobsPageWrapper() {
  return <JobsPageContent />
}

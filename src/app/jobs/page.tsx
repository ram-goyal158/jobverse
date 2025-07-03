'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Dynamically import content component and disable SSR
const JobsPageContent = dynamic(() => import('./JobsPageContent'), {
  ssr: false,
  loading: () => <div className="text-center py-20 text-gray-500">Loading jobs...</div>,
})

export default function JobsPageWrapper() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-500">Loading...</div>}>
      <JobsPageContent />
    </Suspense>
  )
}

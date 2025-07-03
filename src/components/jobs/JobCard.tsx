'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'

interface JobCardProps {
  id: string
  title: string
  company: string
  location: string
  type: string
  postedAt: any // Timestamp from Firebase
}

export default function JobCard({
  id,
  title,
  company,
  location,
  type,
  postedAt,
}: JobCardProps) {
  const postedAgo = postedAt?.seconds
    ? formatDistanceToNow(new Date(postedAt.seconds * 1000), { addSuffix: true })
    : 'Some time ago'

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition"
    >
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600">{company} · {location}</p>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded w-fit">
          {type}
        </span>
        <p className="text-xs text-gray-400">Posted {postedAgo}</p>

        <Link
          href={`/apply/${id}`}
          className="mt-3 inline-block bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Apply Now
        </Link>
      </div>
    </motion.div>
  )
}

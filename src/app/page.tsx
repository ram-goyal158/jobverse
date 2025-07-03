'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation' // Next.js ka router import karein
import { motion } from 'framer-motion'
import Link from 'next/link'
// Lucide icons ka istemal karein consistency ke liye
import { Search, Briefcase, Megaphone, Landmark, Code, Building, Star } from 'lucide-react'

// Updated categories with Lucide icons
const jobCategories = [
  { title: 'Software & IT', icon: <Code />, href: 'it-software', color: 'text-blue-500' },
  { title: 'Marketing', icon: <Megaphone />, href: 'marketing', color: 'text-green-500' },
  { title: 'Finance', icon: <Landmark />, href: 'finance', color: 'text-yellow-500' },
  { title: 'Corporate', icon: <Building />, href: 'corporate', color: 'text-purple-500' },
]

// Dummy company logos
const companies = [
  { name: 'Company A', logo: <Star className="w-8 h-8 text-gray-400" /> },
  { name: 'Company B', logo: <Star className="w-8 h-8 text-gray-400" /> },
  { name: 'Company C', logo: <Star className="w-8 h-8 text-gray-400" /> },
  { name: 'Company D', logo: <Star className="w-8 h-8 text-gray-400" /> },
  { name: 'Company E', logo: <Star className="w-8 h-8 text-gray-400" /> },
]

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter() // useRouter hook ko initialize karein

  // Search function jo /jobs page par redirect karega
  const handleSearch = () => {
    if (searchTerm.trim()) {
      // encodeURIComponent se search term ko URL-safe banate hain
      router.push(`/jobs?search=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  return (
    <div className="bg-slate-50 text-gray-800">
      {/* === Hero Section === */}
      <section className="relative text-center py-20 md:py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-50 z-0"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.h1
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600"
          >
            Your Next Career Move Starts Here.
          </motion.h1>
          <motion.p
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="mt-4 text-lg md:text-xl text-gray-500 max-w-2xl mx-auto"
          >
            Discover thousands of job opportunities from top companies and find the one that's right for you.
          </motion.p>

          {/* === Search Bar === */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="mt-10 max-w-2xl mx-auto"
          >
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Job title, keyword, or company"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-blue-900 text-white px-8 py-3 font-semibold rounded-full hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Search
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* === "Trusted By" Section === */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Trusted by top companies in India</h3>
            <motion.div 
                className="mt-6 flex justify-center items-center flex-wrap gap-x-8 md:gap-x-12 gap-y-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                {/* Yahan aap apni companies ke logos laga sakte hain */}
                {companies.map(company => (
                    <div key={company.name} className="grayscale hover:grayscale-0 transition-all duration-300">
                        {company.logo}
                    </div>
                ))}
            </motion.div>
        </div>
      </section>

      {/* === Job Categories Section === */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold">Browse By Category</h2>
            <p className="mt-3 text-gray-500">Find the perfect job for your skills.</p>
          </motion.div>
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {jobCategories.map((cat) => (
              <Link key={cat.title} href={`/jobs?category=${encodeURIComponent(cat.href)}`}>
                <motion.div
                  variants={fadeIn}
                  whileHover={{ scale: 1.05, y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.08)" }}
                  className="bg-white rounded-xl p-6 text-center border border-gray-200 shadow-sm cursor-pointer transition-all duration-300"
                >
                  <div className={`inline-block p-4 bg-slate-100 rounded-full ${cat.color}`}>
                    {cat.icon}
                  </div>
                  <h3 className="mt-4 font-semibold text-gray-800">{cat.title}</h3>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* === CTA Section === */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-2xl shadow-2xl overflow-hidden">
            <motion.div 
                className="grid md:grid-cols-2 items-center gap-8 p-8 md:p-16"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
            >
                <div>
                    <h3 className="text-3xl md:text-4xl font-bold">Are you an Employer?</h3>
                    <p className="mt-4 text-lg text-gray-300">
                        Post your job for free and connect with millions of qualified candidates. Find the best talent for your team, fast.
                    </p>
                    <Link href="/dashboard/employer/post-job">
                        <span className="mt-8 inline-block bg-white text-blue-600 px-8 py-3 font-bold rounded-full hover:bg-slate-200 transition-colors duration-300 transform hover:scale-105">
                            Post a Job
                        </span>
                    </Link>
                </div>
                <div className="hidden md:flex justify-center items-center">
                    <Briefcase className="w-48 h-48 text-gray-700" />
                </div>
            </motion.div>
        </div>
      </section>
    </div>
  )
}
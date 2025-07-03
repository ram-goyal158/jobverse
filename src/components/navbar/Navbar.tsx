'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const { user, logout, loading } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Jobs', href: '/jobs' },
    ...(user ? [
      { 
        name: 'Dashboard', 
        href: user.role === 'seeker' ? '/dashboard/seeker' : 
             user.role === 'employer' ? '/dashboard/employer' : 
             '/dashboard/admin' 
      },
      { name: 'Profile', href: '/profile' }
    ] : [])
  ]

  if (loading) return null // or loading spinner

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-3xl font-bold text-blue-900">JobVerse</Link>

        <div className="hidden md:flex gap-6 items-center">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href}>
              <span className={`hover:text-blue-900 transition ${pathname === link.href ? 'text-blue-900 font-semibold' : 'text-gray-700'}`}>
                {link.name}
              </span>
            </Link>
          ))}

          {user ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          ) : (
            <Link href="/auth/login">
              <button className="bg-blue-900 text-white px-3 py-1 rounded hover:bg-blue-700 transition">
                Login
              </button>
            </Link>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl text-gray-700">
            ☰
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="md:hidden bg-gray-100 px-4 pb-4 overflow-hidden"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} onClick={() => setMenuOpen(false)}>
                  <span className={`block py-2 hover:text-blue-900 transition ${pathname === link.href ? 'text-blue-700 font-semibold' : 'text-gray-700'}`}>
                    {link.name}
                  </span>
                </Link>
              ))}

              {user ? (
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition mt-2"
                >
                  Logout
                </button>
              ) : (
                <Link href="/auth/login" onClick={() => setMenuOpen(false)}>
                  <button className="bg-blue-900 text-white px-3 py-2 rounded hover:bg-blue-700 transition mt-2">
                    Login
                  </button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
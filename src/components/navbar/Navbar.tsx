'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUser, FiLogOut, FiLayout, FiBriefcase, FiHome, FiMenu, FiX } from 'react-icons/fi' // Icons ke liye

export default function Navbar() {
  const { user, logout, loading } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const dropdownRef = useRef(null)

  // Dropdown ke bahar click karne par use band karne ke liye
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [dropdownRef])

  const handleLogout = async () => {
    setDropdownOpen(false)
    try {
      await logout()
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  // Navigation Links
  const navLinks = [
    { name: 'Home', href: '/', icon: <FiHome /> },
    { name: 'Jobs', href: '/jobs', icon: <FiBriefcase /> },
  ]
  
  if (loading) return (
    <div className="bg-gray-100 dark:bg-gray-900 animate-pulse h-[68px]"></div>
  )

  const mobileMenuVariants = {
    open: {
      clipPath: `circle(1000px at 90% 40px)`,
      transition: {
        type: "spring",
        stiffness: 20,
        restDelta: 2
      }
    },
    closed: {
      clipPath: "circle(24px at 90% 40px)",
      transition: {
        delay: 0.2,
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    }
  }

  const listItemVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 }
      }
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 }
      }
    }
  };


  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              JobVerse
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="relative text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">
                {link.name}
                {pathname === link.href && (
                  <motion.div
                    className="absolute -bottom-2 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400"
                    layoutId="underline"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Auth buttons and User Menu */}
          <div className="flex items-center">
            <div className="hidden md:block">
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center justify-center w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full text-indigo-600 dark:text-indigo-300 font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 focus:ring-indigo-500">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : <FiUser />}
                  </button>
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5"
                      >
                        <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b dark:border-gray-700">
                          <p className="font-semibold">Signed in as</p>
                          <p className="truncate">{user.email}</p>
                        </div>
                        <Link href={user.role === 'admin' ? '/dashboard/admin' : '/dashboard'} onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left">
                          <FiLayout/> Dashboard
                        </Link>
                        <Link href="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left">
                          <FiUser/> Profile
                        </Link>
                        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left">
                          <FiLogOut/> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link href="/auth/login" className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors duration-300">
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden ml-4">
              <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white focus:outline-none">
                <span className="sr-only">Open main menu</span>
                {menuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
          >
            <motion.div 
              className="px-2 pt-2 pb-3 space-y-1 sm:px-3"
              variants={{
                open: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
                closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
              }}
              initial="closed"
              animate="open"
              exit="closed"
            >
              {[...navLinks, ...(user ? [
                { name: 'Dashboard', href: user.role === 'admin' ? '/dashboard/admin' : '/dashboard', icon: <FiLayout/> },
                { name: 'Profile', href: '/profile', icon: <FiUser/> }
              ] : [])].map((link) => (
                <motion.div key={link.name} variants={listItemVariants}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium transition-colors duration-300 ${pathname === link.href ? 'bg-indigo-50 dark:bg-gray-800 text-indigo-700 dark:text-indigo-300' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'}`}
                  >
                    {link.icon} {link.name}
                  </Link>
                </motion.div>
              ))}
              
              <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                {user ? (
                   <motion.button
                     variants={listItemVariants}
                     onClick={handleLogout}
                     className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                   >
                     <FiLogOut/> Logout
                   </motion.button>
                ) : (
                  <motion.div variants={listItemVariants}>
                    <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="w-full block text-center bg-indigo-600 text-white px-4 py-2 rounded-md text-base font-medium hover:bg-indigo-700 transition-colors duration-300">
                      Login
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

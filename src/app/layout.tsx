import './globals.css'
import { Inter } from 'next/font/google'
import { ReactNode } from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import Navbar from '@/components/navbar/Navbar'
import Footer from '@/components/footer/Footer'
import { AuthProvider } from '@/context/AuthContext' // ✅ Import AuthProvider

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'JobVerse | Find Your Next Job',
  description: 'A modern job portal built with Next.js + Firebase',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {/* ✅ Wrap with AuthProvider */}
          <AuthProvider>
            {/* ✅ Global Navbar */}
            <Navbar />

            {/* ✅ Page content */}
            <main className="min-h-screen bg-gray-50">
              {children}
              <Toaster />
            </main>

            {/* ✅ Global Footer */}
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

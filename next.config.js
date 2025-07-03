/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // 🔧 This will skip eslint errors during Vercel build
  },
}

module.exports = nextConfig

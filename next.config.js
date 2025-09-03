/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  poweredByHeader: false,
  images: {
    unoptimized: true
  },
  env: {
    SITE_URL: process.env.SITE_URL || 'https://your-domain.com'
  }
}

module.exports = nextConfig
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  poweredByHeader: false,
  env: {
    SITE_URL: process.env.SITE_URL || 'https://your-domain.com'
  }
}

module.exports = nextConfig
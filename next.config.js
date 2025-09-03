/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  poweredByHeader: false,
  env: {
    SITE_URL: process.env.SITE_URL || 'https://your-domain.com',
    NEXT_PUBLIC_TELEGRAM_BOT_TOKEN: process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN,
    NEXT_PUBLIC_TELEGRAM_CHAT_ID: process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  }
}

module.exports = nextConfig
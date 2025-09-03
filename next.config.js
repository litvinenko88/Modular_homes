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
  },
  // Исключаем API routes из статической генерации
  exportPathMap: async function (defaultPathMap) {
    const pathMap = { ...defaultPathMap };
    // Удаляем API routes из экспорта
    delete pathMap['/api/telegram'];
    return pathMap;
  },
  // Отключаем API routes для статического экспорта
  experimental: {
    missingSuspenseWithCSRBailout: false,
  }
}

module.exports = nextConfig
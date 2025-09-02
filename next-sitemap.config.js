/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://your-domain.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
  exclude: ['/404', '/500'],
  changefreq: 'weekly',
  priority: 1.0,
  sitemapSize: 5000,
  transform: async (config, path) => {
    // Валидация входных параметров для предотвращения проблем безопасности
    if (!config || typeof path !== 'string') {
      throw new Error('Invalid configuration or path parameter');
    }
    
    // Санитизация пути
    const sanitizedPath = path.replace(/[<>"'&]/g, '');
    
    return {
      loc: sanitizedPath,
      changefreq: config.changefreq || 'weekly',
      priority: sanitizedPath === '/' ? 1.0 : 0.8,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    }
  },
}
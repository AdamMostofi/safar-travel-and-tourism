import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/lib/seo'

/** Allow crawling of the public site; keep the admin panel out of the index. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}

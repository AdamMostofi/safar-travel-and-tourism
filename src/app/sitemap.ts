import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/lib/seo'
import { listCruises } from '@/server/cruises'
import { listDestinations } from '@/server/destinations'
import { listPackages } from '@/server/packages'

// Built from live CMS content, so newly-published trips appear.
export const dynamic = 'force-dynamic'

/** The XML sitemap: the fixed pages plus every Package, Destination, and Cruise. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [packages, destinations, cruises] = await Promise.all([
    listPackages(),
    listDestinations(),
    listCruises(),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/packages`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/destinations`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/cruises`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/contact`, changeFrequency: 'monthly', priority: 0.5 },
  ]

  const trip = (prefix: string, slug: string): MetadataRoute.Sitemap[number] => ({
    url: `${SITE_URL}${prefix}/${slug}`,
    changeFrequency: 'monthly',
    priority: 0.6,
  })

  return [
    ...staticRoutes,
    ...packages.map((p) => trip('/packages', p.slug)),
    ...destinations.map((d) => trip('/destinations', d.slug)),
    ...cruises.map((c) => trip('/cruises', c.slug)),
  ]
}

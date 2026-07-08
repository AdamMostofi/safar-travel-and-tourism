import type { Metadata } from 'next'

/**
 * SEO helpers (issue #9): one place that builds per-page `Metadata` so every
 * page ships a title, description, canonical URL, and OpenGraph/Twitter tags in
 * the same shape. `metadataBase` (set on the root layout) resolves the relative
 * `canonical`/`url` paths to absolute URLs.
 */

export const SITE_NAME = 'Safar Travel & Tourism'

/** The public origin, used for canonical/OG URLs and the sitemap. */
export const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'

export function pageMetadata({
  title,
  description,
  path,
  images,
}: {
  /** Page title; omitted on the home page so the layout's default is used. */
  title?: string
  description: string
  /** Absolute-from-root path, e.g. `/packages` — becomes the canonical URL. */
  path: string
  /** Optional social image URL(s) for OpenGraph/Twitter cards. */
  images?: string[]
}): Metadata {
  const ogTitle = title ? `${title} · ${SITE_NAME}` : SITE_NAME
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: ogTitle,
      description,
      url: path,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'en_US',
      ...(images ? { images } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description,
      ...(images ? { images } : {}),
    },
  }
}

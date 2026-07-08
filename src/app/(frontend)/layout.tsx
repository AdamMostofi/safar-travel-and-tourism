import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Fraunces, Inter } from 'next/font/google'

import { SmoothScroll } from '@/components/motion/smooth-scroll'
import { SiteFooter } from '@/components/site-footer'
import { SITE_NAME, SITE_URL } from '@/lib/seo'
import { getSiteSettings } from '@/server/siteSettings'

import './globals.css'

// Display serif (editorial, wanderlust) + body sans, per the brand brief.
const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  axes: ['opsz'],
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
})

const SITE_DESCRIPTION =
  'Curated trips from a trusted Beirut travel agency — browse Packages and enquire.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: '/',
    siteName: SITE_NAME,
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
}

export default async function FrontendLayout({ children }: { children: ReactNode }) {
  // Footer contact/socials come from SiteSettings so they render site-wide.
  const settings = await getSiteSettings()

  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <SmoothScroll>
          <main>{children}</main>
          <SiteFooter settings={settings} />
        </SmoothScroll>
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Fraunces, Inter } from 'next/font/google'

import { SmoothScroll } from '@/components/motion/smooth-scroll'

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

export const metadata: Metadata = {
  title: {
    default: 'Safar Travel & Tourism',
    template: '%s · Safar Travel & Tourism',
  },
  description:
    'Curated trips from a trusted Beirut travel agency — browse Packages and enquire.',
}

export default function FrontendLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <SmoothScroll>
          <main>{children}</main>
        </SmoothScroll>
      </body>
    </html>
  )
}

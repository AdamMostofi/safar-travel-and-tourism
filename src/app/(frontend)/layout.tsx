import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import './globals.css'

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
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}

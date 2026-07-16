'use client'

import type { MouseEvent } from 'react'
import { ArrowUp } from 'lucide-react'

import { getLenis } from '@/lib/lenis-instance'

/**
 * Footer "Back to top" control. The site runs Lenis smooth scrolling, which owns
 * the scroll position — a plain `<a href="#top">` jump gets reverted on Lenis's
 * next frame, so it appears to do nothing. This drives Lenis's own `scrollTo`
 * when present, and falls back to native smooth scroll (reduced-motion visitors,
 * or before Lenis mounts). The `href="#top"` keeps it working without JS.
 */
export function BackToTop({ className }: { className?: string }) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    const lenis = getLenis()
    if (lenis) {
      lenis.scrollTo(0)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <a href="#top" onClick={handleClick} className={className}>
      <ArrowUp className="size-4" aria-hidden />
      Back to top
    </a>
  )
}

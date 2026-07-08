import type { ReactNode } from 'react'
import Image from 'next/image'

import { HeroGradient } from '@/components/hero-gradient'
import { KenBurns, RevealOnScroll } from '@/components/motion'
import { cn } from '@/lib/utils'
import type { MediaView } from '@/server/media'

/**
 * The shared photographic hero for the Package and Destination detail pages: a
 * Ken-Burns photo (Sea & Sand gradient fallback when there's no image yet)
 * under an ink scrim that keeps the caption legible. The `eyebrow` slot lets
 * each page supply its own kicker (a plain label, or a link to the Destination).
 */
export function DetailHero({
  image,
  eyebrow,
  title,
  captionClassName,
}: {
  image: MediaView | null
  eyebrow: ReactNode
  title: string
  /** Width/constraint for the caption block (defaults to the page content width). */
  captionClassName?: string
}) {
  return (
    <div className="relative">
      <KenBurns className="h-[44vh] min-h-[300px] w-full">
        {image ? (
          <Image
            src={image.url}
            alt={image.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <HeroGradient className="bg-gradient-to-br from-sea/25 via-sky/40 to-sand" />
        )}
      </KenBurns>
      {/* Ink scrim so the title stays legible over any photo. */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent" />
      <div className="absolute inset-0 flex items-end">
        <div className={cn('mx-auto w-full px-6 pb-8', captionClassName ?? 'max-w-content')}>
          <RevealOnScroll>
            {eyebrow}
            <h1 className="mt-2 font-display text-4xl text-cream sm:text-5xl">{title}</h1>
          </RevealOnScroll>
        </div>
      </div>
    </div>
  )
}

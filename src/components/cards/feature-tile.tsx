import Image from 'next/image'
import Link from 'next/link'

import { HoverLift } from '@/components/motion'
import type { MediaView } from '@/server/media'

/**
 * A wide, cinematic "feature" tile that leads the editorial browse grids
 * (issue #12): the first Package/Cruise/Destination shown full-width with an
 * overlaid title, so the grids read as a magazine spread rather than a wall of
 * identical cards. Falls back to a Sea & Sand gradient when there's no image.
 */
export function FeatureTile({
  href,
  image,
  eyebrow,
  title,
  meta,
}: {
  href: string
  image: MediaView | null
  eyebrow?: string
  title: string
  meta?: string
}) {
  return (
    <HoverLift className="rounded-2xl">
      <Link
        href={href}
        className="group relative block aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-sea/40 via-sky/40 to-sand shadow-soft hover:shadow-lift sm:aspect-[21/9]"
      >
        {image && (
          <Image
            src={image.url}
            alt={image.alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 72rem"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
          {eyebrow && (
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-sky">
              {eyebrow}
            </p>
          )}
          <h3 className="mt-2 max-w-2xl font-display text-3xl text-cream sm:text-4xl">
            {title}
          </h3>
          {meta && <p className="mt-2 text-cream/90">{meta}</p>}
        </div>
      </Link>
    </HoverLift>
  )
}

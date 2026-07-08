'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

import { gallerySlideOffset } from '@/lib/motion'
import type { MediaView } from '@/server/media'

/**
 * The shared trip photo gallery (Packages and Cruises): a hover-lifting
 * thumbnail grid that opens a lightbox for a closer look, with keyboard
 * (← → Esc) and on-screen paging.
 * Motion is `prefers-reduced-motion`-aware — the overlay still fades, but the
 * slide is dropped and the thumbnail zoom is held.
 */
export function Gallery({ images }: { images: MediaView[] }) {
  const slideX = gallerySlideOffset(Boolean(useReducedMotion()))
  const [openAt, setOpenAt] = useState<number | null>(null)

  const close = useCallback(() => setOpenAt(null), [])
  const step = useCallback(
    (delta: number) =>
      setOpenAt((current) =>
        current === null ? current : (current + delta + images.length) % images.length,
      ),
    [images.length],
  )

  useEffect(() => {
    if (openAt === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') step(1)
      else if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    // Lock scroll while the lightbox is open.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [openAt, close, step])

  if (images.length === 0) return null

  const openImage = openAt === null ? null : images[openAt]

  return (
    <div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((image, i) => (
          <li key={image.url}>
            <button
              type="button"
              onClick={() => setOpenAt(i)}
              aria-label={`View photo ${i + 1} of ${images.length}`}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-sand shadow-soft transition-shadow hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea"
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transform-none"
              />
            </button>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {openImage && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Package photo gallery"
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close gallery"
              className="absolute right-4 top-4 rounded-full bg-cream/10 p-2 text-cream transition-colors hover:bg-cream/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream"
            >
              <X className="size-6" aria-hidden />
            </button>

            {images.length > 1 && (
              <>
                <GalleryNav
                  side="left"
                  onClick={(e) => {
                    e.stopPropagation()
                    step(-1)
                  }}
                />
                <GalleryNav
                  side="right"
                  onClick={(e) => {
                    e.stopPropagation()
                    step(1)
                  }}
                />
              </>
            )}

            {/* Stop propagation so clicking the image itself doesn't close. */}
            <motion.div
              key={openImage.url}
              className="relative h-[70vh] w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, x: slideX }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={openImage.url}
                alt={openImage.alt}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </motion.div>

            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-cream/80">
              {(openAt ?? 0) + 1} / {images.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function GalleryNav({
  side,
  onClick,
}: {
  side: 'left' | 'right'
  onClick: (e: React.MouseEvent) => void
}) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === 'left' ? 'Previous photo' : 'Next photo'}
      className={`absolute top-1/2 -translate-y-1/2 ${
        side === 'left' ? 'left-4' : 'right-4'
      } rounded-full bg-cream/10 p-2 text-cream transition-colors hover:bg-cream/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream`}
    >
      <Icon className="size-6 sm:size-8" aria-hidden />
    </button>
  )
}

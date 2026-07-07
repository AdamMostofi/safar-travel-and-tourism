import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { HeroGradient } from '@/components/hero-gradient'
import { KenBurns, RevealOnScroll } from '@/components/motion'
import { cn } from '@/lib/utils'
import type { MediaView } from '@/server/media'

type HomeHeroProps = {
  /** The destination photo to drift behind the headline, if one is available. */
  image: MediaView | null
  /** Prebuilt `wa.me` link for the secondary "Talk to us" CTA, if configured. */
  whatsappHref: string | null
}

/**
 * The flagship first impression: an image-only Ken-Burns hero drifting behind
 * staggered headline reveals (issue #5). When no photo is available it falls
 * back to the Sea & Sand gradient panel. An ink scrim keeps the light text
 * legible over any photo; the Ken-Burns drift eases out under reduced motion.
 */
export function HomeHero({ image, whatsappHref }: HomeHeroProps) {
  // Over a photo the text sits on a dark scrim (light type); on the gradient
  // fallback it reads as ink so it stays legible either way.
  const onPhoto = Boolean(image)

  return (
    <section className="relative isolate overflow-hidden">
      <KenBurns className="absolute inset-0 -z-10">
        {image ? (
          <div className="relative h-full w-full">
            <Image
              src={image.url}
              alt={image.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ) : (
          <HeroGradient className="bg-gradient-to-br from-sky/70 via-cream to-sand" glow />
        )}
      </KenBurns>

      {onPhoto && (
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/85 via-ink/55 to-ink/35" />
      )}

      <div className="mx-auto flex min-h-[82vh] max-w-content flex-col justify-center px-6 py-24">
        <RevealOnScroll>
          <p className={cn('font-body text-sm uppercase tracking-[0.2em]', onPhoto ? 'text-sky' : 'text-sea')}>
            Safar · سفر — your journey
          </p>
        </RevealOnScroll>
        <RevealOnScroll delay={0.08}>
          <h1
            className={cn(
              'mt-4 max-w-3xl font-display text-5xl leading-tight sm:text-6xl',
              onPhoto ? 'text-cream' : 'text-ink',
            )}
          >
            Journeys worth taking, crafted by people who&apos;ve done this for 20 years.
          </h1>
        </RevealOnScroll>
        <RevealOnScroll delay={0.16}>
          <p className={cn('mt-6 max-w-xl text-lg', onPhoto ? 'text-cream/85' : 'text-ink/75')}>
            A trusted Beirut travel agency making global travel feel accessible —
            from budget regional trips to premium long-haul escapes.
          </p>
        </RevealOnScroll>
        <RevealOnScroll delay={0.24}>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link href="/packages">Browse Packages</Link>
            </Button>
            {whatsappHref && (
              <WhatsAppButton
                href={whatsappHref}
                className={cn(onPhoto && 'border-cream text-cream hover:bg-cream/10')}
              >
                Talk to us
              </WhatsAppButton>
            )}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}

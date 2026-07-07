import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { HeroGradient } from '@/components/hero-gradient'
import {
  AnimatedCounter,
  KenBurns,
  Parallax,
  RevealOnScroll,
} from '@/components/motion'

export default function HomePage() {
  return (
    <>
      {/* Ken-Burns hero over a Sea & Sand gradient (image-only hero, no video). */}
      <section className="relative isolate overflow-hidden">
        <KenBurns className="absolute inset-0 -z-10">
          <HeroGradient className="bg-gradient-to-br from-sky/70 via-cream to-sand" glow />
        </KenBurns>

        <div className="mx-auto flex min-h-[82vh] max-w-content flex-col justify-center px-6 py-24">
          <RevealOnScroll>
            <p className="font-body text-sm uppercase tracking-[0.2em] text-sea">
              Safar · سفر — your journey
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.08}>
            <h1 className="mt-4 max-w-3xl font-display text-5xl leading-tight text-ink sm:text-6xl">
              Journeys worth taking, crafted by people who&apos;ve done this for 20 years.
            </h1>
          </RevealOnScroll>
          <RevealOnScroll delay={0.16}>
            <p className="mt-6 max-w-xl text-lg text-ink/75">
              A trusted Beirut travel agency making global travel feel
              accessible — from budget regional trips to premium long-haul
              escapes.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.24}>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/packages">Browse Packages</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/packages">Talk to us</Link>
              </Button>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Proof metrics — animated counters. */}
      <section className="border-y border-border bg-cream/60">
        <div className="mx-auto grid max-w-content gap-8 px-6 py-16 sm:grid-cols-3">
          {[
            { value: 20, suffix: '+', label: 'Years guiding travellers' },
            { value: 150, suffix: '+', label: 'Destinations worldwide' },
            { value: 100, suffix: '%', label: 'Enquiry-led, human service' },
          ].map((stat, i) => (
            <RevealOnScroll key={stat.label} delay={i * 0.08}>
              <div className="text-center sm:text-left">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  className="font-display text-5xl text-sea"
                />
                <p className="mt-2 text-sm text-ink/70">{stat.label}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* A parallax closing band to prove depth on scroll. */}
      <section className="relative overflow-hidden bg-sand/50">
        <div className="mx-auto max-w-content px-6 py-section-lg text-center">
          <Parallax factor={0.15}>
            <RevealOnScroll>
              <h2 className="mx-auto max-w-2xl font-display text-3xl text-ink sm:text-4xl">
                Tell us where you&apos;re dreaming of. We&apos;ll handle the rest.
              </h2>
            </RevealOnScroll>
          </Parallax>
          <RevealOnScroll delay={0.1}>
            <Button asChild size="lg" className="mt-8">
              <Link href="/packages">See our Packages</Link>
            </Button>
          </RevealOnScroll>
        </div>
      </section>
    </>
  )
}

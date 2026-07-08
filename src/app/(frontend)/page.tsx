import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { HomeHero } from '@/components/home/hero'
import { PackageCard } from '@/components/cards/package-card'
import { DestinationCard } from '@/components/cards/destination-card'
import { AnimatedCounter, Parallax, RevealOnScroll } from '@/components/motion'
import { whatsappLink } from '@/lib/contact'
import { proofMetricsList } from '@/lib/proofMetrics'
import { SERVICES } from '@/lib/services'
import { listFeaturedPackages } from '@/server/packages'
import { listFeaturedDestinations } from '@/server/destinations'
import { getSiteSettings } from '@/server/siteSettings'

// Content is CMS-driven; render fresh so newly-featured items appear.
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [featuredPackages, featuredDestinations, settings] = await Promise.all([
    listFeaturedPackages(),
    listFeaturedDestinations(),
    getSiteSettings(),
  ])

  const metrics = proofMetricsList(settings.proofMetrics)
  const whatsappHref = whatsappLink(
    settings.whatsapp,
    'Hi Safar, I have a question about a trip.',
  )
  // Lead with a real destination photo; fall back to a featured Package's hero.
  const heroImage =
    featuredDestinations.find((d) => d.heroImage)?.heroImage ??
    featuredPackages.find((p) => p.heroImage)?.heroImage ??
    null

  return (
    <>
      <HomeHero image={heroImage} whatsappHref={whatsappHref} />

      {/* Proof metrics — animated counters from SiteSettings. */}
      {metrics.length > 0 && (
        <section className="border-y border-border bg-cream/60">
          <div className="mx-auto grid max-w-content gap-8 px-6 py-16 grid-cols-2 sm:grid-cols-3">
            {metrics.map((stat, i) => (
              <RevealOnScroll key={stat.key} delay={i * 0.06}>
                <div className="text-center sm:text-left">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    className="font-display text-4xl text-sea sm:text-5xl"
                  />
                  <p className="mt-2 text-sm text-ink/70">{stat.label}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </section>
      )}

      {/* Featured Packages — "Popular Tours". */}
      {featuredPackages.length > 0 && (
        <section className="mx-auto max-w-content px-6 py-section">
          <RevealOnScroll>
            <p className="font-body text-sm uppercase tracking-[0.2em] text-sea">
              Popular Tours
            </p>
            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
              Featured Packages
            </h2>
          </RevealOnScroll>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredPackages.map((pkg, i) => (
              <li key={pkg.id}>
                <RevealOnScroll delay={i * 0.06}>
                  <PackageCard pkg={pkg} />
                </RevealOnScroll>
              </li>
            ))}
          </ul>
          <RevealOnScroll delay={0.1}>
            <div className="mt-10">
              <Button asChild variant="outline">
                <Link href="/packages">See all Packages</Link>
              </Button>
            </div>
          </RevealOnScroll>
        </section>
      )}

      {/* Featured Destinations — "Top Destinations". */}
      {featuredDestinations.length > 0 && (
        <section className="bg-sand/40">
          <div className="mx-auto max-w-content px-6 py-section">
            <RevealOnScroll>
              <p className="font-body text-sm uppercase tracking-[0.2em] text-sea">
                Top Destinations
              </p>
              <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
                Featured Destinations
              </h2>
            </RevealOnScroll>
            <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {featuredDestinations.map((destination, i) => (
                <li key={destination.id}>
                  <RevealOnScroll delay={i * 0.05}>
                    <DestinationCard destination={destination} />
                  </RevealOnScroll>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Services overview — what Safar does. */}
      <section className="mx-auto max-w-content px-6 py-section">
        <RevealOnScroll>
          <p className="font-body text-sm uppercase tracking-[0.2em] text-sea">
            How we help
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl text-ink sm:text-4xl">
            Everything between the daydream and the departure gate.
          </h2>
        </RevealOnScroll>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service, i) => (
            <li key={service.title}>
              <RevealOnScroll delay={i * 0.06}>
                <div className="h-full rounded-2xl bg-card p-6 shadow-soft">
                  <service.icon className="size-8 text-sea" aria-hidden />
                  <h3 className="mt-4 font-display text-xl text-ink">{service.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70">{service.body}</p>
                </div>
              </RevealOnScroll>
            </li>
          ))}
        </ul>
      </section>

      {/* Conversion CTA. */}
      <section className="relative overflow-hidden bg-sea">
        <div className="mx-auto max-w-content px-6 py-section-lg text-center">
          <Parallax factor={0.15}>
            <RevealOnScroll>
              <h2 className="mx-auto max-w-2xl font-display text-3xl text-cream sm:text-4xl">
                Tell us where you&apos;re dreaming of. We&apos;ll handle the rest.
              </h2>
            </RevealOnScroll>
          </Parallax>
          <RevealOnScroll delay={0.1}>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/packages">See our Packages</Link>
              </Button>
              {whatsappHref && (
                <WhatsAppButton
                  href={whatsappHref}
                  className="border-cream text-cream hover:bg-cream/10"
                >
                  Message us on WhatsApp
                </WhatsAppButton>
              )}
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </>
  )
}

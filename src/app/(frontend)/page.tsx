import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { ScrollExpandHero } from '@/components/home/scroll-expand-hero'
import { RotatingGallery } from '@/components/rotating-gallery'
import { ZoomParallax } from '@/components/zoom-parallax'
import { Parallax, RevealOnScroll } from '@/components/motion'
import { BookingTimeline } from '@/components/booking-timeline'
import { ServicesBento } from '@/components/services-bento'
import { TestimonialsSection } from '@/components/testimonials/testimonials-section'
import { StatBand } from '@/components/stat-band'
import { whatsappLink } from '@/lib/contact'
import { proofMetricsList } from '@/lib/proofMetrics'
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
  // Featured Packages as rotating-showcase slides, each linking to its trip.
  const featuredJourneys = featuredPackages
    .filter((pkg) => pkg.heroImage)
    .map((pkg) => ({
      src: pkg.heroImage!.url,
      alt: pkg.heroImage!.alt,
      label: `${pkg.country} · from $${pkg.startingPrice}`,
      caption: pkg.title,
      href: `/packages/${pkg.slug}`,
    }))
  // Lead with a real destination photo; fall back to a featured Package's hero.
  const heroImage =
    featuredDestinations.find((d) => d.heroImage)?.heroImage ??
    featuredPackages.find((p) => p.heroImage)?.heroImage ??
    null

  return (
    <>
      <ScrollExpandHero image={heroImage} whatsappHref={whatsappHref} />

      {/* Proof metrics — a glassy stat band from SiteSettings. */}
      <StatBand metrics={metrics} />

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
          <RevealOnScroll delay={0.06}>
            <div className="mt-10">
              <RotatingGallery items={featuredJourneys} />
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="mt-8">
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
            <div className="mt-10">
              <ZoomParallax destinations={featuredDestinations} />
            </div>
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
        <div className="mt-10">
          <ServicesBento />
        </div>
      </section>

      {/* How booking works — the enquiry-led flow. */}
      <BookingTimeline />

      {/* What travellers say. */}
      <TestimonialsSection />

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

import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { BookingTimeline } from '@/components/booking-timeline'
import { RevealOnScroll } from '@/components/motion'
import { ServicesBento } from '@/components/services-bento'
import { StatBand } from '@/components/stat-band'
import { TestimonialsSection } from '@/components/testimonials/testimonials-section'
import { proofMetricsList } from '@/lib/proofMetrics'
import { pageMetadata } from '@/lib/seo'
import { getSiteSettings } from '@/server/siteSettings'

export const metadata = pageMetadata({
  title: 'About',
  description:
    'Safar Travel & Tourism is a Beirut travel agency curating trips worth taking - and the people who see them through, by phone and WhatsApp.',
  path: '/about',
})

// Proof figures come from the CMS; render fresh so edits appear.
export const dynamic = 'force-dynamic'

export default async function AboutPage() {
  const settings = await getSiteSettings()
  const metrics = proofMetricsList(settings.proofMetrics)

  return (
    <div>
      <section className="mx-auto max-w-content px-6 py-section">
        <RevealOnScroll>
          <p className="font-body text-sm uppercase tracking-[0.2em] text-sea">
            Our story
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl text-ink sm:text-5xl">
            A Beirut travel agency for journeys worth taking.
          </h1>
        </RevealOnScroll>

        <div className="mt-8 max-w-2xl space-y-6 text-lg leading-relaxed text-ink/80">
          <RevealOnScroll delay={0.06}>
            <p>
              For more than twenty years, Safar Travel &amp; Tourism has planned
              trips from our home in Clemenceau, Beirut - from a weekend on the
              Turkish Riviera to a fortnight island-hopping the Aegean. We&apos;re a
              small team who still believe travel is personal, so we curate every
              Package by hand rather than list a thousand you&apos;ll never book.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <p>
              We don&apos;t take payment online. You browse the trips, tell us the
              one you&apos;re dreaming of, and a real advisor picks it up by phone
              or WhatsApp - answering questions, tailoring the details, and holding
              your hand from the daydream to the departure gate.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* Proof figures from SiteSettings — the same trust numbers as the home page. */}
      <StatBand metrics={metrics} />

      {/* What we do — the shared services overview. */}
      <section className="mx-auto max-w-content px-6 py-section">
        <RevealOnScroll>
          <p className="font-body text-sm uppercase tracking-[0.2em] text-sea">
            What we do
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

      {/* Mission. */}
      <section className="bg-sand/40">
        <div className="mx-auto max-w-content px-6 py-section">
          <RevealOnScroll>
            <p className="font-body text-sm uppercase tracking-[0.2em] text-sea">
              Our mission
            </p>
            <p className="mt-4 max-w-3xl font-display text-2xl leading-snug text-ink sm:text-3xl">
              To create memorable journeys, one destination at a time - with honest
              advice, fair Starting Prices, and a real person on the other end of
              the line.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild>
                <Link href="/packages">Browse Packages</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/contact">Get in touch</Link>
              </Button>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  )
}

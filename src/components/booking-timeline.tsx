import { RevealOnScroll } from '@/components/motion'

/**
 * "How booking works" — a four-step process timeline (issue #12) that sells the
 * enquiry-led, no-online-payment model (ADR-0002): Browse → Enquire → We tailor
 * it → Travel. Shared by the home and About pages. Static layout, so it needs no
 * reduced-motion handling beyond the reveal it already inherits.
 */
const STEPS = [
  {
    title: 'Browse',
    body: 'Explore Packages and Cruises — each with a clear Starting Price and what it includes.',
  },
  {
    title: 'Enquire',
    body: 'Send a quick enquiry or message us on WhatsApp. No checkout, no payment online.',
  },
  {
    title: 'We tailor it',
    body: 'A real advisor gets back to you, answers your questions, and shapes the trip around you.',
  },
  {
    title: 'Travel',
    body: "Confirm the plan and go — we've sorted the flights, visas, and paperwork.",
  },
]

export function BookingTimeline() {
  return (
    <section className="bg-secondary/30">
      <div className="mx-auto max-w-content px-6 py-section">
        <RevealOnScroll>
          <p className="font-body text-sm uppercase tracking-[0.2em] text-sea">
            How it works
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl text-ink sm:text-4xl">
            From the daydream to the departure gate.
          </h2>
        </RevealOnScroll>

        <ol className="relative mt-12 grid gap-10 md:grid-cols-4">
          {/* Connector track behind the step markers (desktop). */}
          <div
            className="absolute left-0 right-0 top-6 hidden h-px bg-border md:block"
            aria-hidden
          />
          {STEPS.map((step, i) => (
            <li key={step.title} className="relative">
              <RevealOnScroll delay={i * 0.08}>
                <div className="flex flex-col items-center text-center md:items-start md:text-left">
                  <div className="flex size-12 items-center justify-center rounded-full bg-sea font-display text-lg text-cream ring-4 ring-background">
                    {i + 1}
                  </div>
                  <h3 className="mt-4 font-display text-xl text-ink">{step.title}</h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink/70">
                    {step.body}
                  </p>
                </div>
              </RevealOnScroll>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

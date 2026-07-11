'use client'

import { useId, useRef, useState } from 'react'
import { Check, Compass, MessageCircle, Plane, Sparkles, type LucideIcon } from 'lucide-react'

import { RevealOnScroll } from '@/components/motion'
import { cn } from '@/lib/utils'

/**
 * "How it works" — the enquiry-led, no-online-payment journey (ADR-0002) shown
 * as an interactive value chain: Browse → Enquire → We tailor it → Travel. Each
 * stage is a node on a connected path; selecting one (click, or arrow-keys as an
 * ARIA tablist) reveals its details below. Shared by the home and About pages.
 * Motion is limited to gentle colour/width transitions, disabled under
 * prefers-reduced-motion via the `motion-reduce` variant.
 */
type Step = {
  title: string
  icon: LucideIcon
  body: string
  points: string[]
}

const STEPS: Step[] = [
  {
    title: 'Browse',
    icon: Compass,
    body: 'Explore Packages and Cruises, each with a clear Starting Price and what it includes.',
    points: [
      'Clear Starting Prices, never a checkout total',
      'See exactly what each trip includes',
      'Filter and search by Destination',
    ],
  },
  {
    title: 'Enquire',
    icon: MessageCircle,
    body: 'Send a quick enquiry or message us on WhatsApp. No checkout, no payment online.',
    points: [
      'Enquire in seconds from any trip',
      'Reach a real advisor on WhatsApp',
      'No online payment, ever',
    ],
  },
  {
    title: 'We tailor it',
    icon: Sparkles,
    body: 'A real advisor gets back to you, answers your questions, and shapes the trip around you.',
    points: [
      'A real person, not a bot',
      'Honest advice on dates and budget',
      'The itinerary shaped around you',
    ],
  },
  {
    title: 'Travel',
    icon: Plane,
    body: "Confirm the plan and go, we've sorted the flights, visas, and paperwork.",
    points: [
      'Flights and transfers arranged',
      'Visas and paperwork handled',
      'Support with you while you travel',
    ],
  },
]

export function BookingTimeline() {
  const [active, setActive] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const baseId = useId()
  const tabId = (i: number) => `${baseId}-tab-${i}`
  const panelId = `${baseId}-panel`

  const onKeyDown = (e: React.KeyboardEvent) => {
    const n = STEPS.length
    let next: number | null = null
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (active + 1) % n
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (active - 1 + n) % n
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = n - 1
    if (next !== null) {
      e.preventDefault()
      setActive(next)
      tabRefs.current[next]?.focus()
    }
  }

  const current = STEPS[active]
  const progress = STEPS.length > 1 ? (active / (STEPS.length - 1)) * 100 : 0

  return (
    <section className="bg-secondary/30">
      <div className="mx-auto max-w-content px-6 py-section">
        <RevealOnScroll>
          <p className="font-body text-sm uppercase tracking-[0.2em] text-sea">How it works</p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl text-ink sm:text-4xl">
            From the daydream to the departure gate.
          </h2>
        </RevealOnScroll>

        <RevealOnScroll delay={0.08}>
          {/* Value-chain nodes (ARIA tablist). */}
          <div
            role="tablist"
            aria-label="How booking works"
            onKeyDown={onKeyDown}
            className="relative mt-12 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4"
          >
            {/* Connector track + progress fill (desktop). */}
            <div
              className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-0.5 bg-border sm:block"
              aria-hidden
            >
              <div
                className="h-full bg-sea transition-[width] duration-300 ease-out motion-reduce:transition-none"
                style={{ width: `${progress}%` }}
              />
            </div>

            {STEPS.map((step, i) => {
              const Icon = step.icon
              const selected = i === active
              const done = i <= active
              return (
                <button
                  key={step.title}
                  ref={(el) => {
                    tabRefs.current[i] = el
                  }}
                  role="tab"
                  id={tabId(i)}
                  aria-selected={selected}
                  aria-controls={panelId}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  className="group relative flex flex-col items-center gap-3 focus-visible:outline-none"
                >
                  <span
                    className={cn(
                      'flex size-16 items-center justify-center rounded-full border-2 bg-background transition-colors duration-200 ring-4 ring-background motion-reduce:transition-none',
                      done ? 'border-sea' : 'border-border',
                      selected ? 'bg-sea text-cream' : 'text-sea group-hover:border-sea/70',
                      'group-focus-visible:ring-sea/40',
                    )}
                  >
                    <Icon className="size-6" aria-hidden />
                  </span>
                  <span
                    className={cn(
                      'font-display text-base transition-colors sm:text-lg',
                      selected ? 'text-ink' : 'text-ink/70 group-hover:text-ink',
                    )}
                  >
                    {step.title}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Selected stage details. */}
          <div
            role="tabpanel"
            id={panelId}
            aria-labelledby={tabId(active)}
            className="mt-10 rounded-2xl bg-card p-6 shadow-soft sm:p-8"
          >
            <h3 className="font-display text-2xl text-ink">{current.title}</h3>
            <p className="mt-2 max-w-2xl leading-relaxed text-ink/80">{current.body}</p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-3">
              {current.points.map((point) => (
                <li key={point} className="flex items-start gap-2 text-sm text-ink/80">
                  <Check className="mt-0.5 size-5 shrink-0 text-sea" aria-hidden />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}

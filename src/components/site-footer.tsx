import Link from 'next/link'
import { ArrowUp, Facebook, Instagram, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'

import { SafarLogo } from '@/components/brand/safar-logo'
import { mailtoLink, telLink, whatsappLink } from '@/lib/contact'
import type { SiteSettingsView } from '@/server/siteSettings'

/**
 * The site-wide footer (PRD story 29): a rounded deep-ink panel with the brand
 * lockup, tagline, socials and a "Back to top" control on the left, and tidy
 * link columns (Explore + Get in touch) on the right, over a subtle geometric
 * line pattern. Everything reads from `SiteSettings` so staff edit it in one
 * place; phone/email/WhatsApp become real `tel:` / `mailto:` / `wa.me` links.
 */

const EXPLORE = [
  { href: '/packages', label: 'Packages' },
  { href: '/destinations', label: 'Destinations' },
  { href: '/cruises', label: 'Cruises' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function SiteFooter({ settings }: { settings: SiteSettingsView }) {
  const whatsapp = whatsappLink(settings.whatsapp)
  const email = mailtoLink(settings.email)
  const phones = [...settings.mobiles, settings.landline].filter((n): n is string => Boolean(n))
  const socials = [
    { label: 'Instagram', href: settings.socials.instagram, Icon: Instagram },
    { label: 'Facebook', href: settings.socials.facebook, Icon: Facebook },
  ].filter((s): s is { label: string; href: string; Icon: typeof Instagram } => Boolean(s.href))

  const linkClass = 'text-cream/75 transition-colors hover:text-cream'

  return (
    <footer className="px-4 pb-6 pt-10 sm:px-6">
      <div className="relative mx-auto max-w-content overflow-hidden rounded-3xl bg-ink text-cream/90">
        {/* Subtle geometric line pattern. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, #7dd3fc 0, #7dd3fc 1px, transparent 1px, transparent 24px)',
          }}
        />

        <div className="relative grid gap-10 p-8 sm:p-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <SafarLogo badged className="text-cream" />
            {settings.footerTagline && (
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/70">
                {settings.footerTagline}
              </p>
            )}

            {socials.length > 0 && (
              <div className="mt-6 flex gap-3">
                {socials.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex size-10 items-center justify-center rounded-full border border-cream/20 text-cream/80 transition-colors hover:border-sky hover:text-cream"
                  >
                    <Icon className="size-4" aria-hidden />
                  </a>
                ))}
              </div>
            )}

            <a
              href="#top"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-cream/25 px-4 py-2 text-xs font-medium text-cream/80 transition-colors hover:border-sky hover:text-cream"
            >
              <ArrowUp className="size-4" aria-hidden />
              Back to top
            </a>
          </div>

          {/* Explore */}
          <div>
            <h2 className="font-display text-lg text-cream">Explore</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {EXPLORE.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get in touch */}
          <div>
            <h2 className="font-display text-lg text-cream">Get in touch</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {phones.map((phone) => (
                <li key={phone}>
                  <a href={telLink(phone) ?? undefined} className={`inline-flex items-center gap-2 ${linkClass}`}>
                    <Phone className="size-4 shrink-0 text-sky" aria-hidden />
                    {phone}
                  </a>
                </li>
              ))}
              {email && (
                <li>
                  <a href={email} className={`inline-flex items-center gap-2 ${linkClass}`}>
                    <Mail className="size-4 shrink-0 text-sky" aria-hidden />
                    {settings.email}
                  </a>
                </li>
              )}
              {whatsapp && (
                <li>
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 ${linkClass}`}
                  >
                    <MessageCircle className="size-4 shrink-0 text-sky" aria-hidden />
                    WhatsApp us
                  </a>
                </li>
              )}
              {settings.address && (
                <li className="flex items-start gap-2 text-cream/75">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-sky" aria-hidden />
                  <span>{settings.address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Copyright bar */}
        <div className="relative border-t border-cream/10">
          <div className="flex flex-wrap items-center justify-between gap-2 px-8 py-5 text-xs text-cream/60 sm:px-12">
            <span>© {new Date().getFullYear()} Safar Travel &amp; Tourism. All rights reserved.</span>
            {/* Staff-only entry to the Payload admin (full navigation, separate app). */}
            <a href="/admin" className="transition-colors hover:text-cream">
              Staff login
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

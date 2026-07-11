import Link from 'next/link'
import { ArrowUp, Facebook, Instagram, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'

import { SafarLogo } from '@/components/brand/safar-logo'
import { mailtoLink, telLink, whatsappLink } from '@/lib/contact'
import type { SiteSettingsView } from '@/server/siteSettings'

/**
 * The site-wide footer (PRD story 29): a full-bleed deep-ink band over a subtle
 * geometric line pattern, with three columns side by side — the brand lockup
 * (logo, tagline, contact/social icon buttons, "Back to top"), an Explore column,
 * and a Get in touch column. Everything reads from `SiteSettings` so staff edit
 * it in one place; email/WhatsApp/phone become real `mailto:` / `wa.me` / `tel:`
 * links.
 */

const EXPLORE = [
  { href: '/packages', label: 'Packages' },
  { href: '/destinations', label: 'Destinations' },
  { href: '/cruises', label: 'Cruises' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

type IconLink = { label: string; href: string; Icon: typeof Instagram; external: boolean }

export function SiteFooter({ settings }: { settings: SiteSettingsView }) {
  const whatsapp = whatsappLink(settings.whatsapp)
  const email = mailtoLink(settings.email)
  const phones = [...settings.mobiles, settings.landline].filter((n): n is string => Boolean(n))

  // Instagram, Facebook, email and WhatsApp all render as circular icon buttons.
  const contactIcons: IconLink[] = [
    settings.socials.instagram && {
      label: 'Instagram',
      href: settings.socials.instagram,
      Icon: Instagram,
      external: true,
    },
    settings.socials.facebook && {
      label: 'Facebook',
      href: settings.socials.facebook,
      Icon: Facebook,
      external: true,
    },
    email && { label: 'Email us', href: email, Icon: Mail, external: false },
    whatsapp && { label: 'WhatsApp us', href: whatsapp, Icon: MessageCircle, external: true },
  ].filter((x): x is IconLink => Boolean(x))

  const linkClass = 'text-cream/75 transition-colors hover:text-cream'

  return (
    <footer className="relative overflow-hidden bg-ink text-cream/90">
      {/* Subtle geometric line pattern. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, var(--sky) 0, var(--sky) 1px, transparent 1px, transparent 24px)',
        }}
      />

      <div className="relative mx-auto grid max-w-content gap-10 px-6 py-14 sm:grid-cols-3 sm:px-8">
        {/* Brand */}
        <div>
          <SafarLogo badged className="text-cream" />
          {settings.footerTagline && (
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/70">
              {settings.footerTagline}
            </p>
          )}

          {contactIcons.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3">
              {contactIcons.map(({ label, href, Icon, external }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
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
        <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-2 px-6 py-5 text-xs text-cream/60 sm:px-8">
          <span>© {new Date().getFullYear()} Safar Travel &amp; Tourism. All rights reserved.</span>
          {/* Staff-only entry to the Payload admin (full navigation, separate app). */}
          <a href="/admin" className="transition-colors hover:text-cream">
            Staff login
          </a>
        </div>
      </div>
    </footer>
  )
}

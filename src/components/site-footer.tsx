import Link from 'next/link'
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'

import { mailtoLink, telLink, whatsappLink } from '@/lib/contact'
import type { SiteSettingsView } from '@/server/siteSettings'

/**
 * The site-wide footer (PRD story 29): brand tagline, contact details, and
 * socials, all read from `SiteSettings` so staff edit them in one place. Phone,
 * email, and WhatsApp become real `tel:` / `mailto:` / `wa.me` links via the
 * pure builders in `@/lib/contact`.
 */
export function SiteFooter({ settings }: { settings: SiteSettingsView }) {
  const whatsapp = whatsappLink(settings.whatsapp)
  const email = mailtoLink(settings.email)
  const phones = [...settings.mobiles, settings.landline].filter(
    (n): n is string => Boolean(n),
  )
  const socials = [
    { label: 'Instagram', href: settings.socials.instagram },
    { label: 'Facebook', href: settings.socials.facebook },
  ].filter((s): s is { label: string; href: string } => Boolean(s.href))

  return (
    <footer className="mt-section-lg border-t border-border bg-ink text-cream/90">
      <div className="mx-auto grid max-w-content gap-12 px-6 py-16 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="font-display text-2xl text-cream">Safar · سفر</p>
          {settings.footerTagline && (
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/70">
              {settings.footerTagline}
            </p>
          )}
        </div>

        <div>
          <h2 className="font-display text-lg text-cream">Get in touch</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {phones.map((phone) => (
              <li key={phone}>
                <a
                  href={telLink(phone) ?? undefined}
                  className="inline-flex items-center gap-2 text-cream/80 transition-colors hover:text-cream"
                >
                  <Phone className="size-4 shrink-0 text-sky" aria-hidden />
                  {phone}
                </a>
              </li>
            ))}
            {email && (
              <li>
                <a
                  href={email}
                  className="inline-flex items-center gap-2 text-cream/80 transition-colors hover:text-cream"
                >
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
                  className="inline-flex items-center gap-2 text-cream/80 transition-colors hover:text-cream"
                >
                  <MessageCircle className="size-4 shrink-0 text-sky" aria-hidden />
                  WhatsApp us
                </a>
              </li>
            )}
            {settings.address && (
              <li className="flex items-start gap-2 text-cream/80">
                <MapPin className="mt-0.5 size-4 shrink-0 text-sky" aria-hidden />
                <span>{settings.address}</span>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-lg text-cream">Follow the journey</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cream/80 transition-colors hover:text-cream"
                >
                  {social.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href="/packages"
                className="text-cream/80 transition-colors hover:text-cream"
              >
                Browse Packages
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto max-w-content px-6 py-6 text-xs text-cream/60">
          © {new Date().getFullYear()} Safar Travel &amp; Tourism. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

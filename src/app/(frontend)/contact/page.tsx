import { Facebook, Instagram, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'

import { WhatsAppButton } from '@/components/whatsapp-button'
import { RevealOnScroll } from '@/components/motion'
import { mailtoLink, telLink, whatsappLink } from '@/lib/contact'
import { pageMetadata } from '@/lib/seo'
import { getSiteSettings } from '@/server/siteSettings'

export const metadata = pageMetadata({
  title: 'Contact',
  description:
    'Reach Safar Travel & Tourism in Clemenceau, Beirut - by phone, email, or WhatsApp. A real advisor answers.',
  path: '/contact',
})

// Contact details come from SiteSettings; render fresh so staff edits appear.
export const dynamic = 'force-dynamic'

/** A Google Maps search link for the agency address (opens the full map). */
const mapLink = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`

/** An embeddable Google Maps URL (no API key needed) centred on the address. */
const mapEmbed = (address: string) =>
  `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`

type IconLink = { label: string; href: string; Icon: typeof Instagram; external: boolean }

export default async function ContactPage() {
  const settings = await getSiteSettings()

  const phones = [...settings.mobiles, settings.landline].filter((n): n is string => Boolean(n))
  const email = mailtoLink(settings.email)
  const whatsapp = whatsappLink(settings.whatsapp, 'Hi Safar, I have a question about a trip.')

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

  return (
    <div className="mx-auto max-w-content px-6 py-section">
      <RevealOnScroll>
        <p className="font-body text-sm uppercase tracking-[0.2em] text-sea">Get in touch</p>
        <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">Contact us</h1>
        <p className="mt-4 max-w-xl text-lg text-ink/70">
          Tell us where you&apos;re dreaming of and a real advisor will help - no checkout, no
          bots. We reply fastest on WhatsApp.
        </p>
      </RevealOnScroll>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        {/* Reach channels — every value from SiteSettings. */}
        <RevealOnScroll>
          <div className="h-full rounded-2xl bg-card p-8 shadow-soft">
            <h2 className="font-display text-2xl text-ink">Reach us</h2>
            <ul className="mt-6 space-y-4 text-ink/80">
              {phones.map((phone) => (
                <li key={phone}>
                  <a
                    href={telLink(phone) ?? undefined}
                    className="inline-flex items-center gap-3 transition-colors hover:text-sea"
                  >
                    <Phone className="size-5 shrink-0 text-sea" aria-hidden />
                    {phone}
                  </a>
                </li>
              ))}
            </ul>

            {contactIcons.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xs uppercase tracking-wide text-ink/70">Message or follow us</h3>
                <ul className="mt-3 flex flex-wrap gap-4">
                  {contactIcons.map(({ label, href, Icon, external }) => (
                    <li key={label}>
                      <a
                        href={href}
                        aria-label={label}
                        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        className="inline-flex size-11 items-center justify-center rounded-full bg-sea/10 text-sea transition-colors hover:bg-sea/20"
                      >
                        <Icon className="size-5" aria-hidden />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {whatsapp && (
              <div className="mt-8">
                <WhatsAppButton href={whatsapp}>Chat on WhatsApp</WhatsAppButton>
              </div>
            )}
          </div>
        </RevealOnScroll>

        {/* Visit us — address + an embedded live map. */}
        <RevealOnScroll delay={0.08}>
          <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-card shadow-soft">
            <div className="p-8 pb-5">
              <h2 className="font-display text-2xl text-ink">Visit us</h2>
              <p className="mt-4 flex items-start gap-3 text-lg text-ink/80">
                <MapPin className="mt-1 size-6 shrink-0 text-sea" aria-hidden />
                <span>{settings.address ?? 'Clemenceau, Beirut, Lebanon'}</span>
              </p>
            </div>
            <iframe
              title="Safar Travel & Tourism location on Google Maps"
              src={mapEmbed(settings.address ?? 'Clemenceau, Beirut, Lebanon')}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-64 w-full border-0 grayscale-[0.2]"
            />
            <div className="flex items-center justify-between gap-2 p-6 text-sm text-ink/70">
              <span>Office hours by phone and WhatsApp - a real person, not a queue.</span>
              <a
                href={mapLink(settings.address ?? 'Clemenceau, Beirut, Lebanon')}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 font-medium text-sea hover:underline"
              >
                Open map →
              </a>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </div>
  )
}

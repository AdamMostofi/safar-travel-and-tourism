import { Facebook, Instagram, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'

import { WhatsAppButton } from '@/components/whatsapp-button'
import { RevealOnScroll } from '@/components/motion'
import { mailtoLink, telLink, whatsappLink } from '@/lib/contact'
import { pageMetadata } from '@/lib/seo'
import { getSiteSettings } from '@/server/siteSettings'

export const metadata = pageMetadata({
  title: 'Contact',
  description:
    'Reach Safar Travel & Tourism in Clemenceau, Beirut — by phone, email, or WhatsApp. A real advisor answers.',
  path: '/contact',
})

// Contact details come from SiteSettings; render fresh so staff edits appear.
export const dynamic = 'force-dynamic'

/** A Google Maps search link for the agency address (a lightweight location cue). */
const mapLink = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`

export default async function ContactPage() {
  const settings = await getSiteSettings()

  const phones = [...settings.mobiles, settings.landline].filter(
    (n): n is string => Boolean(n),
  )
  const email = mailtoLink(settings.email)
  const whatsapp = whatsappLink(
    settings.whatsapp,
    'Hi Safar, I have a question about a trip.',
  )
  const socials = [
    { label: 'Instagram', href: settings.socials.instagram, icon: Instagram },
    { label: 'Facebook', href: settings.socials.facebook, icon: Facebook },
  ].filter((s): s is { label: string; href: string; icon: typeof Instagram } =>
    Boolean(s.href),
  )

  return (
    <div className="mx-auto max-w-content px-6 py-section">
      <RevealOnScroll>
        <p className="font-body text-sm uppercase tracking-[0.2em] text-sea">
          Get in touch
        </p>
        <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">Contact us</h1>
        <p className="mt-4 max-w-xl text-lg text-ink/70">
          Tell us where you&apos;re dreaming of and a real advisor will help — no
          checkout, no bots. We reply fastest on WhatsApp.
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
              {email && (
                <li>
                  <a
                    href={email}
                    className="inline-flex items-center gap-3 transition-colors hover:text-sea"
                  >
                    <Mail className="size-5 shrink-0 text-sea" aria-hidden />
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
                    className="inline-flex items-center gap-3 transition-colors hover:text-sea"
                  >
                    <MessageCircle className="size-5 shrink-0 text-sea" aria-hidden />
                    Message us on WhatsApp
                  </a>
                </li>
              )}
            </ul>

            {socials.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xs uppercase tracking-wide text-ink/70">
                  Follow the journey
                </h3>
                <ul className="mt-3 flex gap-4">
                  {socials.map((social) => (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="inline-flex size-11 items-center justify-center rounded-full bg-sea/10 text-sea transition-colors hover:bg-sea/20"
                      >
                        <social.icon className="size-5" aria-hidden />
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

        {/* Location cue — address + a link out to the map. */}
        <RevealOnScroll delay={0.08}>
          <div className="flex h-full flex-col rounded-2xl bg-gradient-to-br from-sea/15 via-sky/20 to-sand p-8 shadow-soft">
            <h2 className="font-display text-2xl text-ink">Visit us</h2>
            {settings.address ? (
              <>
                <p className="mt-6 flex items-start gap-3 text-lg text-ink/80">
                  <MapPin className="mt-1 size-6 shrink-0 text-sea" aria-hidden />
                  <span>{settings.address}</span>
                </p>
                <a
                  href={mapLink(settings.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-sm font-medium text-sea hover:underline"
                >
                  View on Google Maps →
                </a>
              </>
            ) : (
              <p className="mt-6 text-ink/70">Beirut, Lebanon</p>
            )}
            <div className="mt-auto pt-8 text-sm text-ink/70">
              Office hours by phone and WhatsApp — a real person, not a queue.
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </div>
  )
}

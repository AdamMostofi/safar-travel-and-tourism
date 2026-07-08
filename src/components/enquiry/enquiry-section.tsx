import { EnquiryForm } from '@/components/enquiry/enquiry-form'
import { RevealOnScroll } from '@/components/motion'
import { whatsappLink } from '@/lib/contact'
import { tripEnquiryMessage, type TripContext } from '@/lib/enquiry'
import { getSiteSettings } from '@/server/siteSettings'

/**
 * The "Request this trip" section shared by the Package and Cruise detail
 * pages. Reads the WhatsApp number from SiteSettings, builds the prefilled
 * deep-link for this trip, and renders the enquiry form — so both detail pages
 * offer the same enquiry-led conversion path (ADR-0002) without duplication.
 */
export async function EnquirySection({ trip }: { trip: TripContext }) {
  const settings = await getSiteSettings()
  const whatsappHref = whatsappLink(settings.whatsapp, tripEnquiryMessage(trip))

  return (
    <RevealOnScroll delay={0.08}>
      <section id="enquire" className="mt-12 scroll-mt-24">
        <h2 className="font-display text-2xl text-ink">Request this trip</h2>
        <p className="mt-2 text-ink/70">
          Tell us a little about your plans and an advisor will take it from there.
        </p>
        <div className="mt-6">
          <EnquiryForm trip={trip} whatsappHref={whatsappHref} />
        </div>
      </section>
    </RevealOnScroll>
  )
}

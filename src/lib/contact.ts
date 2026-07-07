/**
 * Builders that turn raw contact details from `SiteSettings` into correct,
 * clickable links for the footer and CTAs (PRD story 29). Kept as pure
 * functions (unit-tested in `contact.unit.test.ts`) so components stay
 * declarative and the link shapes are asserted without a browser.
 */

/** A `tel:` href for a phone number (keeping a leading `+`), or null if blank. */
export const telLink = (phone: string | null | undefined): string | null => {
  if (!phone) return null
  const cleaned = phone.replace(/[^\d+]/g, '')
  return cleaned ? `tel:${cleaned}` : null
}

/** A `mailto:` href for an email address, or null if there is none. */
export const mailtoLink = (email: string | null | undefined): string | null =>
  email ? `mailto:${email}` : null

/**
 * A `wa.me` deep link from a WhatsApp number (digits only), optionally
 * prefilling a message. Returns null when there is no number.
 */
export const whatsappLink = (
  whatsapp: string | null | undefined,
  message?: string,
): string | null => {
  if (!whatsapp) return null
  const digits = whatsapp.replace(/\D/g, '')
  if (!digits) return null
  const base = `https://wa.me/${digits}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

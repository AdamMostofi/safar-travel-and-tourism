import type { Payload } from 'payload'

import {
  type EnquiryInput,
  type EnquiryResult,
  validateEnquiry,
} from '../lib/enquiry'
import { getPayloadClient } from '../lib/payload'
import { getSiteSettings } from './siteSettings'

/**
 * The enquiry-led conversion action (ADR-0002): validate the input, persist a
 * `Lead` (with the trip context captured on it), and notify staff by email —
 * returning a typed success/error result the form renders. `payload` is
 * injectable so integration tests run against the test DB.
 *
 * The Lead is the source of truth; a failed notification is logged but does not
 * fail the enquiry, so a mail hiccup never loses a captured Lead.
 */
export const submitEnquiry = async (
  input: EnquiryInput,
  payload?: Payload,
): Promise<EnquiryResult> => {
  const errors = validateEnquiry(input)
  if (Object.keys(errors).length > 0) return { ok: false, errors }

  const client = payload ?? (await getPayloadClient())

  const lead = await client.create({
    collection: 'leads',
    data: {
      name: input.name.trim(),
      contact: input.contact.trim(),
      preferredDates: input.preferredDates?.trim() || undefined,
      partySize: input.partySize ?? undefined,
      message: input.message?.trim() || undefined,
      tripType: input.trip.type,
      tripTitle: input.trip.title,
      tripSlug: input.trip.slug,
      tripStartingPrice: input.trip.startingPrice,
    },
  })

  await notifyStaff(client, input).catch((err: unknown) => {
    client.logger.error({ err }, 'Failed to send enquiry notification email')
  })

  return { ok: true, leadId: String(lead.id) }
}

/** Emails the staff inbox (from `SiteSettings`) a plain-text summary of the enquiry. */
const notifyStaff = async (client: Payload, input: EnquiryInput): Promise<void> => {
  const settings = await getSiteSettings(client)
  const to = settings.email
  if (!to) return

  const lines = [
    `New enquiry for ${input.trip.title} (${input.trip.type}, Starting $${input.trip.startingPrice}).`,
    '',
    `Name: ${input.name}`,
    `Contact: ${input.contact}`,
    input.preferredDates ? `Preferred dates: ${input.preferredDates}` : null,
    input.partySize ? `Party size: ${input.partySize}` : null,
    input.message ? `Message: ${input.message}` : null,
  ].filter((line): line is string => line !== null)

  await client.sendEmail({
    to,
    subject: `New enquiry: ${input.trip.title}`,
    text: lines.join('\n'),
  })
}

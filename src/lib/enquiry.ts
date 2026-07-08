/**
 * Pure enquiry logic (ADR-0002, issue #8): the shape of an Enquiry, its
 * validation, and the prefilled WhatsApp message. Kept dependency-free (no
 * Payload, no DB) so it is unit-tested in `enquiry.unit.test.ts` and shared by
 * the server action, the form, and the WhatsApp CTA. The DB write and staff
 * notification live in `src/server/enquiries.ts`.
 */

/** The Package/Cruise an Enquiry is about, captured onto the Lead. */
export type TripContext = {
  type: 'package' | 'cruise'
  title: string
  slug: string
  startingPrice: number
}

/** The raw enquiry a visitor submits from a trip's "Request this trip" form. */
export type EnquiryInput = {
  name: string
  contact: string
  preferredDates?: string
  partySize?: number | null
  message?: string
  trip: TripContext
}

/** The fields that can carry a validation error. */
export type EnquiryField = 'name' | 'contact' | 'partySize' | 'trip'

/** Field-keyed validation messages; empty means the input is valid. */
export type EnquiryErrors = Partial<Record<EnquiryField, string>>

/** The typed outcome of `submitEnquiry`, surfaced to the form. */
export type EnquiryResult =
  | { ok: true; leadId: string }
  | { ok: false; errors: EnquiryErrors }

/**
 * Validates an enquiry, returning field-keyed messages. Name and a contact
 * method are required (so staff can reply); a party size, if given, must be at
 * least one; and the trip context must be present and well-formed.
 */
export const validateEnquiry = (input: EnquiryInput): EnquiryErrors => {
  const errors: EnquiryErrors = {}

  if (!input.name?.trim()) {
    errors.name = 'Please tell us your name.'
  }
  if (!input.contact?.trim()) {
    errors.contact = 'Add a phone, email, or WhatsApp so we can reply.'
  }
  if (
    input.partySize != null &&
    (!Number.isFinite(input.partySize) || input.partySize < 1)
  ) {
    errors.partySize = 'Party size must be at least 1.'
  }
  const trip = input.trip
  if (!trip?.title?.trim() || (trip.type !== 'package' && trip.type !== 'cruise')) {
    errors.trip = 'Missing trip details — please try again from the trip page.'
  }

  return errors
}

/** The prefilled WhatsApp message for a trip's one-tap enquiry CTA. */
export const tripEnquiryMessage = (trip: TripContext): string =>
  `Hi Safar, I'd like to request the "${trip.title}" ${trip.type} (Starting $${trip.startingPrice}).`

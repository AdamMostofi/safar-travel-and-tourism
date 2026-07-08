'use server'

import type { EnquiryResult, TripContext } from '@/lib/enquiry'
import { submitEnquiry } from '@/server/enquiries'

/** Form state for `useActionState`: `null` before the first submit. */
export type EnquiryFormState = EnquiryResult | null

/**
 * The `useActionState` server action behind the "Request this trip" form. Reads
 * the trip context from hidden fields (so the Lead records what was being
 * viewed) and delegates validation + persistence to `submitEnquiry`.
 */
export async function enquiryAction(
  _prev: EnquiryFormState,
  formData: FormData,
): Promise<EnquiryResult> {
  const partySizeRaw = formData.get('partySize')
  const partySize = partySizeRaw ? Number(partySizeRaw) : null

  const trip: TripContext = {
    type: formData.get('tripType') === 'cruise' ? 'cruise' : 'package',
    title: String(formData.get('tripTitle') ?? ''),
    slug: String(formData.get('tripSlug') ?? ''),
    startingPrice: Number(formData.get('tripStartingPrice') ?? 0),
  }

  return submitEnquiry({
    name: String(formData.get('name') ?? ''),
    contact: String(formData.get('contact') ?? ''),
    preferredDates: String(formData.get('preferredDates') ?? ''),
    partySize,
    message: String(formData.get('message') ?? ''),
    trip,
  })
}

import type { Payload } from 'payload'
import { beforeAll, describe, expect, it, vi } from 'vitest'

import { resetAndSeed } from '../../test/seed-helpers'
import type { EnquiryInput } from '../lib/enquiry'
import { getPayloadClient } from '../lib/payload'
import { submitEnquiry } from './enquiries'

/**
 * Integration tests for the enquiry action (ADR-0002) against a real (test)
 * Postgres. They assert external behaviour: a Lead is created with the trip
 * context captured, staff are notified, and invalid input is rejected without
 * touching the DB.
 */
describe('submitEnquiry', () => {
  let payload: Payload

  const validInput = (): EnquiryInput => ({
    name: 'Layla Haddad',
    contact: 'layla@example.com',
    preferredDates: 'Late August',
    partySize: 2,
    message: 'Honeymoon — over-water villa if possible.',
    trip: { type: 'package', title: 'Maldives', slug: 'maldives', startingPrice: 1299 },
  })

  beforeAll(async () => {
    payload = await getPayloadClient()
    await resetAndSeed(payload)
  })

  it('creates a Lead, captures the trip context, and notifies staff', async () => {
    const sendEmail = vi.spyOn(payload, 'sendEmail').mockResolvedValue(undefined as never)

    const result = await submitEnquiry(validInput(), payload)

    expect(result.ok).toBe(true)
    if (!result.ok) return

    const lead = await payload.findByID({ collection: 'leads', id: result.leadId })
    expect(lead).toMatchObject({
      name: 'Layla Haddad',
      contact: 'layla@example.com',
      preferredDates: 'Late August',
      partySize: 2,
      tripType: 'package',
      tripTitle: 'Maldives',
      tripSlug: 'maldives',
      tripStartingPrice: 1299,
    })

    // Staff were notified at the SiteSettings inbox with the trip in the subject.
    expect(sendEmail).toHaveBeenCalledTimes(1)
    const message = sendEmail.mock.calls[0][0] as { to?: string; subject?: string }
    expect(message.to).toBe('info@safartravelandtourism.com')
    expect(message.subject).toContain('Maldives')

    sendEmail.mockRestore()
  })

  it('rejects invalid input with typed errors and creates no Lead', async () => {
    const before = await payload.count({ collection: 'leads' })
    const sendEmail = vi.spyOn(payload, 'sendEmail').mockResolvedValue(undefined as never)

    const result = await submitEnquiry({ ...validInput(), name: '', contact: '' }, payload)

    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.errors.name).toBeTruthy()
    expect(result.errors.contact).toBeTruthy()

    const after = await payload.count({ collection: 'leads' })
    expect(after.totalDocs).toBe(before.totalDocs)
    expect(sendEmail).not.toHaveBeenCalled()

    sendEmail.mockRestore()
  })
})

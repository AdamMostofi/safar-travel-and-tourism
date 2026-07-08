import { describe, expect, it } from 'vitest'

import {
  type EnquiryInput,
  tripEnquiryMessage,
  validateEnquiry,
} from './enquiry'

const validInput = (): EnquiryInput => ({
  name: 'Layla',
  contact: '+961 3 000 000',
  partySize: 2,
  trip: { type: 'package', title: 'Maldives', slug: 'maldives', startingPrice: 1299 },
})

describe('validateEnquiry', () => {
  it('accepts a complete enquiry', () => {
    expect(validateEnquiry(validInput())).toEqual({})
  })

  it('requires a name', () => {
    expect(validateEnquiry({ ...validInput(), name: '  ' })).toHaveProperty('name')
  })

  it('requires a contact method', () => {
    expect(validateEnquiry({ ...validInput(), contact: '' })).toHaveProperty('contact')
  })

  it('rejects a party size below one', () => {
    expect(validateEnquiry({ ...validInput(), partySize: 0 })).toHaveProperty('partySize')
  })

  it('allows an omitted party size', () => {
    expect(validateEnquiry({ ...validInput(), partySize: null })).toEqual({})
  })

  it('requires well-formed trip context', () => {
    const errors = validateEnquiry({
      ...validInput(),
      // @ts-expect-error — exercising a malformed trip type at the boundary
      trip: { type: 'flight', title: '', slug: '', startingPrice: 0 },
    })
    expect(errors).toHaveProperty('trip')
  })
})

describe('tripEnquiryMessage', () => {
  it('prefills the trip title, kind, and Starting Price', () => {
    const message = tripEnquiryMessage({
      type: 'cruise',
      title: 'MSC Seaside',
      slug: 'msc-seaside',
      startingPrice: 2100,
    })
    expect(message).toContain('MSC Seaside')
    expect(message).toContain('cruise')
    expect(message).toContain('Starting $2100')
  })
})

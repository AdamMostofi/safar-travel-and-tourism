import { describe, expect, it } from 'vitest'

import type { SiteSettingsView } from '@/server/siteSettings'
import { proofMetricsList } from './proofMetrics'

/**
 * The home-page proof counters are driven by `SiteSettings.proofMetrics` (issue
 * #5). This pure mapping fixes their order, labels, and suffixes and drops any
 * metric a staff member has left blank, so the section never renders an empty
 * or mislabelled counter.
 */
const metrics = (
  partial: Partial<SiteSettingsView['proofMetrics']>,
): SiteSettingsView['proofMetrics'] => ({
  yearsExperience: null,
  destinationsCount: null,
  flightBookings: null,
  amazingTours: null,
  happyClients: null,
  cruisesBookings: null,
  ...partial,
})

describe('proofMetricsList', () => {
  it('maps a metric to a labelled, suffixed counter', () => {
    const [first] = proofMetricsList(metrics({ yearsExperience: 20 }))
    expect(first).toMatchObject({
      key: 'yearsExperience',
      value: 20,
      suffix: '+',
      label: 'Years of experience',
    })
  })

  it('keeps the canonical order regardless of which metrics are set', () => {
    const list = proofMetricsList(
      metrics({ destinationsCount: 150, yearsExperience: 20, happyClients: 700 }),
    )
    expect(list.map((m) => m.key)).toEqual([
      'yearsExperience',
      'destinationsCount',
      'happyClients',
    ])
  })

  it('drops metrics that are unset (null)', () => {
    const list = proofMetricsList(metrics({ yearsExperience: 20 }))
    expect(list).toHaveLength(1)
  })

  it('keeps a zero value (a real, if unusual, figure)', () => {
    const list = proofMetricsList(metrics({ happyClients: 0 }))
    expect(list).toHaveLength(1)
    expect(list[0]?.value).toBe(0)
  })

  it('is empty when no metrics are set', () => {
    expect(proofMetricsList(metrics({}))).toEqual([])
  })
})

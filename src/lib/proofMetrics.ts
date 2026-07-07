import type { SiteSettingsView } from '@/server/siteSettings'

/**
 * The home-page proof counters, driven by `SiteSettings.proofMetrics` (issue
 * #5). This pure mapping fixes their order, labels, and suffixes and drops any
 * metric staff have left blank, so the section never renders an empty or
 * mislabelled counter. Unit-tested in `proofMetrics.unit.test.ts`.
 */

type MetricKey = keyof SiteSettingsView['proofMetrics']

/** A single proof metric shaped for the `AnimatedCounter` grid. */
export type ProofMetric = {
  key: MetricKey
  value: number
  suffix: string
  label: string
}

/**
 * Canonical order + copy for the trust figures the home page leads with (issue
 * #5: "20 years, 150+ destinations, happy clients, bookings"). Other metrics in
 * the `SiteSettings` schema are intentionally not surfaced here to keep the
 * counter row focused.
 */
const METRIC_ORDER: { key: MetricKey; label: string; suffix: string }[] = [
  { key: 'yearsExperience', label: 'Years of experience', suffix: '+' },
  { key: 'destinationsCount', label: 'Destinations', suffix: '+' },
  { key: 'happyClients', label: 'Happy clients', suffix: '+' },
  { key: 'flightBookings', label: 'Flight bookings', suffix: '+' },
]

/** The set metrics, in canonical order, shaped for the counters. */
export const proofMetricsList = (
  metrics: SiteSettingsView['proofMetrics'],
): ProofMetric[] =>
  METRIC_ORDER.flatMap(({ key, label, suffix }) => {
    const value = metrics[key]
    return value == null ? [] : [{ key, value, suffix, label }]
  })

import { describe, expect, it } from 'vitest'

import { ASSISTANT_DEFAULTS, resolveAssistant } from './assistant'

/**
 * The Marlo assistant's identity (issue #31) is editable in the SiteSettings
 * global, but every field is optional and the global may predate the fields
 * entirely. `resolveAssistant` folds the raw CMS values together with code
 * defaults into the config the UI renders: blank name/greeting fall back to the
 * defaults, and the assistant is enabled unless it has been explicitly turned
 * off. Kept pure so the fallback policy is asserted without a database.
 */
describe('resolveAssistant', () => {
  it('uses code defaults when the group is absent', () => {
    expect(resolveAssistant(null)).toEqual({
      enabled: true,
      name: ASSISTANT_DEFAULTS.name,
      greeting: ASSISTANT_DEFAULTS.greeting,
    })
    expect(resolveAssistant(undefined)).toEqual({
      enabled: true,
      name: ASSISTANT_DEFAULTS.name,
      greeting: ASSISTANT_DEFAULTS.greeting,
    })
  })

  it('keeps staff-provided name and greeting', () => {
    expect(resolveAssistant({ name: 'Rihla', greeting: 'Ahlan!' })).toEqual({
      enabled: true,
      name: 'Rihla',
      greeting: 'Ahlan!',
    })
  })

  it('falls back to defaults for blank or whitespace-only fields', () => {
    expect(resolveAssistant({ name: '   ', greeting: '' })).toEqual({
      enabled: true,
      name: ASSISTANT_DEFAULTS.name,
      greeting: ASSISTANT_DEFAULTS.greeting,
    })
  })

  it('trims surrounding whitespace from provided values', () => {
    expect(resolveAssistant({ name: '  Marlo  ', greeting: '  Hi there  ' })).toMatchObject({
      name: 'Marlo',
      greeting: 'Hi there',
    })
  })

  it('is enabled by default but off only when explicitly disabled', () => {
    expect(resolveAssistant({}).enabled).toBe(true)
    expect(resolveAssistant({ enabled: null }).enabled).toBe(true)
    expect(resolveAssistant({ enabled: false }).enabled).toBe(false)
    expect(resolveAssistant({ enabled: true }).enabled).toBe(true)
  })
})

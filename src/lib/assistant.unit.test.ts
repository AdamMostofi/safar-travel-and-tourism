import { describe, expect, it } from 'vitest'

import { ASSISTANT_DEFAULTS, resolveAssistant, resolveAssistantActions } from './assistant'

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
      actions: [],
    })
    expect(resolveAssistant(undefined)).toEqual({
      enabled: true,
      name: ASSISTANT_DEFAULTS.name,
      greeting: ASSISTANT_DEFAULTS.greeting,
      actions: [],
    })
  })

  it('keeps staff-provided name and greeting', () => {
    expect(resolveAssistant({ name: 'Rihla', greeting: 'Ahlan!' })).toEqual({
      enabled: true,
      name: 'Rihla',
      greeting: 'Ahlan!',
      actions: [],
    })
  })

  it('falls back to defaults for blank or whitespace-only fields', () => {
    expect(resolveAssistant({ name: '   ', greeting: '' })).toEqual({
      enabled: true,
      name: ASSISTANT_DEFAULTS.name,
      greeting: ASSISTANT_DEFAULTS.greeting,
      actions: [],
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

  it('resolves the quick-action list too', () => {
    const config = resolveAssistant({
      actions: [{ type: 'route', label: 'Cruises', target: '/cruises' }],
    })
    expect(config.actions).toEqual([
      { type: 'route', label: 'Cruises', emoji: null, href: '/cruises' },
    ])
  })
})

/**
 * Quick-action chips (issue #32) come from the CMS `actions` array. Each raw
 * item is optional and may be half-filled while an editor is working, so
 * `resolveAssistantActions` maps them into render-ready actions and drops any
 * that can't be shown. This slice renders only `route` chips (navigate to an
 * internal path); other types are ignored until their slice lands.
 */
describe('resolveAssistantActions', () => {
  it('returns an empty list for an absent or empty array', () => {
    expect(resolveAssistantActions(null)).toEqual([])
    expect(resolveAssistantActions(undefined)).toEqual([])
    expect(resolveAssistantActions([])).toEqual([])
  })

  it('maps a valid route action to a render action with an href', () => {
    expect(
      resolveAssistantActions([
        { type: 'route', label: 'Explore Cruises', emoji: '🚢', target: '/cruises' },
      ]),
    ).toEqual([{ type: 'route', label: 'Explore Cruises', emoji: '🚢', href: '/cruises' }])
  })

  it('treats a blank emoji as none', () => {
    expect(
      resolveAssistantActions([{ type: 'route', label: 'Packages', emoji: '  ', target: '/packages' }])[0]
        .emoji,
    ).toBeNull()
  })

  it('trims the label and target', () => {
    expect(
      resolveAssistantActions([
        { type: 'route', label: '  Top Destinations  ', target: '  /destinations  ' },
      ])[0],
    ).toMatchObject({ label: 'Top Destinations', href: '/destinations' })
  })

  it('drops actions missing a label or a target', () => {
    expect(
      resolveAssistantActions([
        { type: 'route', label: '', target: '/x' },
        { type: 'route', label: 'No target', target: '' },
      ]),
    ).toEqual([])
  })

  it('ignores action types this slice does not render yet', () => {
    expect(
      resolveAssistantActions([
        { type: 'whatsapp', label: 'Message us', target: '' },
        { type: 'route', label: 'Cruises', target: '/cruises' },
      ]),
    ).toEqual([{ type: 'route', label: 'Cruises', emoji: null, href: '/cruises' }])
  })

  it('maps a valid faq action to a render action with its answer', () => {
    expect(
      resolveAssistantActions([
        { type: 'faq', label: 'Do I need a visa?', emoji: '🛂', answer: 'It depends on your nationality.' },
      ]),
    ).toEqual([
      { type: 'faq', label: 'Do I need a visa?', emoji: '🛂', answer: 'It depends on your nationality.' },
    ])
  })

  it('drops a faq action with no answer, and a route action with no target', () => {
    expect(
      resolveAssistantActions([
        { type: 'faq', label: 'Empty answer', answer: '   ' },
        { type: 'route', label: 'No target', target: '' },
      ]),
    ).toEqual([])
  })

  it('preserves order across mixed route and faq actions', () => {
    expect(
      resolveAssistantActions([
        { type: 'route', label: 'Cruises', target: '/cruises' },
        { type: 'faq', label: 'Payment?', answer: 'We take a deposit.' },
      ]),
    ).toEqual([
      { type: 'route', label: 'Cruises', emoji: null, href: '/cruises' },
      { type: 'faq', label: 'Payment?', emoji: null, answer: 'We take a deposit.' },
    ])
  })
})

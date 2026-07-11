import { describe, expect, it } from 'vitest'

import {
  ASSISTANT_DEFAULTS,
  groupAssistantActions,
  resolveAssistant,
  resolveAssistantActions,
} from './assistant'
import type { AssistantAction } from './assistant'

/**
 * The site assistant's greeting is editable by staff in the SiteSettings
 * global, but the field is optional and the global may predate it.
 * `resolveAssistant` folds the raw CMS values together with code defaults into
 * the config the UI renders: a blank greeting falls back to the default, and
 * the assistant is enabled unless it has been explicitly turned off. The
 * assistant has no persona name. Kept pure so the policy is asserted without a
 * database.
 */
describe('resolveAssistant', () => {
  it('uses code defaults when the group is absent', () => {
    expect(resolveAssistant(null)).toEqual({
      enabled: true,
      greeting: ASSISTANT_DEFAULTS.greeting,
      actions: [],
    })
    expect(resolveAssistant(undefined)).toEqual({
      enabled: true,
      greeting: ASSISTANT_DEFAULTS.greeting,
      actions: [],
    })
  })

  it('keeps a staff-provided greeting', () => {
    expect(resolveAssistant({ greeting: 'Ahlan!' })).toEqual({
      enabled: true,
      greeting: 'Ahlan!',
      actions: [],
    })
  })

  it('falls back to the default for a blank or whitespace-only greeting', () => {
    expect(resolveAssistant({ greeting: '' })).toEqual({
      enabled: true,
      greeting: ASSISTANT_DEFAULTS.greeting,
      actions: [],
    })
  })

  it('trims surrounding whitespace from the greeting', () => {
    expect(resolveAssistant({ greeting: '  Hi there  ' })).toMatchObject({
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

  it('ignores unrecognised action types', () => {
    expect(
      resolveAssistantActions([
        { type: 'popup', label: 'Mystery', target: '/x' },
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

  it('builds a whatsapp action into a wa.me link from the site number', () => {
    expect(
      resolveAssistantActions(
        [{ type: 'whatsapp', label: 'Message us', emoji: '💬', message: 'Hi Safar' }],
        { whatsapp: '96181800480' },
      ),
    ).toEqual([
      { type: 'whatsapp', label: 'Message us', emoji: '💬', href: 'https://wa.me/96181800480?text=Hi%20Safar' },
    ])
  })

  it('builds a whatsapp link without a prefilled message when none is given', () => {
    expect(
      resolveAssistantActions([{ type: 'whatsapp', label: 'Message us' }], {
        whatsapp: '96181800480',
      }),
    ).toEqual([
      { type: 'whatsapp', label: 'Message us', emoji: null, href: 'https://wa.me/96181800480' },
    ])
  })

  it('drops a whatsapp action when no site WhatsApp number is configured', () => {
    expect(
      resolveAssistantActions([{ type: 'whatsapp', label: 'Message us' }], { whatsapp: null }),
    ).toEqual([])
    // context omitted entirely
    expect(resolveAssistantActions([{ type: 'whatsapp', label: 'Message us' }])).toEqual([])
  })

  it('maps an enquiry action to an internal href from its target', () => {
    expect(
      resolveAssistantActions([{ type: 'enquiry', label: 'Send an enquiry', target: '/contact' }]),
    ).toEqual([{ type: 'enquiry', label: 'Send an enquiry', emoji: null, href: '/contact' }])
  })

  it('drops an enquiry action with no target', () => {
    expect(
      resolveAssistantActions([{ type: 'enquiry', label: 'No target', target: '' }]),
    ).toEqual([])
  })
})

/**
 * The panel opens on a short menu of intent commands rather than every action
 * at once. `groupAssistantActions` buckets the resolved actions into one
 * category per action type present, in a fixed order (WhatsApp → inquiry →
 * question → explore), so the root menu reads consistently and only offers
 * commands that lead somewhere.
 */
describe('groupAssistantActions', () => {
  const whatsapp: AssistantAction = {
    type: 'whatsapp',
    label: 'Message us',
    emoji: null,
    href: 'https://wa.me/1',
  }
  const enquiry: AssistantAction = {
    type: 'enquiry',
    label: 'Send an enquiry',
    emoji: null,
    href: '/contact',
  }
  const faq: AssistantAction = { type: 'faq', label: 'Visa?', emoji: null, answer: 'Maybe.' }
  const route: AssistantAction = { type: 'route', label: 'Cruises', emoji: null, href: '/cruises' }

  it('returns nothing when there are no actions', () => {
    expect(groupAssistantActions([])).toEqual([])
  })

  it('makes one category per type present, in the fixed menu order', () => {
    // Deliberately supplied out of order to prove ordering is imposed.
    const groups = groupAssistantActions([route, faq, enquiry, whatsapp])
    expect(groups.map((g) => g.type)).toEqual(['whatsapp', 'enquiry', 'faq', 'route'])
  })

  it('omits types that have no showable action', () => {
    const groups = groupAssistantActions([faq, route])
    expect(groups.map((g) => g.type)).toEqual(['faq', 'route'])
  })

  it('collects every action of a type under its category, preserving order', () => {
    const faq2: AssistantAction = { type: 'faq', label: 'Payment?', emoji: null, answer: 'Deposit.' }
    const groups = groupAssistantActions([faq, faq2])
    expect(groups).toHaveLength(1)
    expect(groups[0].type).toBe('faq')
    expect(groups[0].actions).toEqual([faq, faq2])
  })

  it('gives each category a label, emoji and intro', () => {
    const [group] = groupAssistantActions([whatsapp])
    expect(group.label).toBe('Message us on WhatsApp')
    expect(group.emoji).toBe('💬')
    expect(group.intro.length).toBeGreaterThan(0)
  })
})

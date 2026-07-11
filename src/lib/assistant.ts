/**
 * The site assistant's configuration.
 *
 * The greeting is editable by staff in the SiteSettings global, but the field
 * is optional and the global may predate it. `resolveAssistant` folds the raw
 * CMS values together with the code defaults below into the single config the
 * UI renders — so a blank field never shows empty copy, and the assistant stays
 * on unless it has been explicitly switched off. The assistant has no persona
 * name.
 *
 * Kept pure (no Payload/database access) so the fallback policy is unit-tested
 * without a database; the server reads the raw group and passes it here.
 */

import { whatsappLink } from './contact'

/**
 * A quick-action chip, ready to render. A `route` chip navigates to an internal
 * path (#32); a `faq` chip expands a plain-text answer inline (#33); a
 * `whatsapp` chip opens a `wa.me` deep link in a new tab; an `enquiry` chip
 * navigates to the enquiry/contact flow (#34).
 */
export type AssistantAction =
  | {
      type: 'route'
      label: string
      emoji: string | null
      /** Internal path the chip navigates to, e.g. `/cruises`. */
      href: string
    }
  | {
      type: 'faq'
      label: string
      emoji: string | null
      /** Plain-text answer shown when the chip is expanded. */
      answer: string
    }
  | {
      type: 'whatsapp'
      label: string
      emoji: string | null
      /** External `wa.me` deep link, opened in a new tab. */
      href: string
    }
  | {
      type: 'enquiry'
      label: string
      emoji: string | null
      /** Internal path to the enquiry/contact flow. */
      href: string
    }

/** The kind of a resolved action — also the key a root menu groups by. */
export type AssistantActionType = AssistantAction['type']

/**
 * A top-level intent in the assistant's menu. The panel opens on these rather
 * than every action at once; picking one shows a short, persuasive `intro` and
 * reveals its `actions` below. There is one category per action type that has
 * at least one showable action.
 */
export type AssistantCategory = {
  type: AssistantActionType
  /** Menu button label, e.g. "Message us on WhatsApp". */
  label: string
  /** A leading emoji for the menu row. */
  emoji: string
  /** A short, warm sales line shown above the options when the category opens. */
  intro: string
  actions: AssistantAction[]
}

/** Config the `SiteAssistant` UI renders. */
export type AssistantConfig = {
  enabled: boolean
  greeting: string
  actions: AssistantAction[]
}

/**
 * Fixed presentation for each action type, plus the order it appears in the
 * menu. Labels and intros are code-owned (not CMS fields) so the menu reads
 * consistently and on-message; staff still control the leaves via the `actions`
 * array. Intros are written to reassure and gently move the visitor to act.
 */
const CATEGORY_META: Record<AssistantActionType, { label: string; emoji: string; intro: string }> = {
  whatsapp: {
    label: 'Message us on WhatsApp',
    emoji: '💬',
    intro: 'Smart move - you’ll be chatting with a real Safar advisor in seconds. Tap below to start:',
  },
  enquiry: {
    label: 'Send an enquiry',
    emoji: '✉️',
    intro: 'Tell us the dream and we’ll shape the trip around you. A real advisor replies personally:',
  },
  faq: {
    label: 'Ask a question',
    emoji: '💡',
    intro: 'Ask away - here are the answers travellers reach for most:',
  },
  route: {
    label: 'Explore our journeys',
    emoji: '🧭',
    intro: 'Let’s find where you go next. Here’s a good place to start:',
  },
}

/** The order categories appear in the root menu. */
const CATEGORY_ORDER: AssistantActionType[] = ['whatsapp', 'enquiry', 'faq', 'route']

/**
 * Bucket resolved actions into ordered root-menu categories, one per action
 * type present. Types with no showable action are dropped, so the menu only
 * ever offers commands that lead somewhere.
 */
export function groupAssistantActions(actions: AssistantAction[]): AssistantCategory[] {
  return CATEGORY_ORDER.flatMap((type) => {
    const forType = actions.filter((action) => action.type === type)
    if (forType.length === 0) return []
    return [{ type, ...CATEGORY_META[type], actions: forType }]
  })
}

/** A raw quick-action row as stored in the SiteSettings `assistant.actions` array. */
export type RawAssistantAction = {
  type?: string | null
  label?: string | null
  emoji?: string | null
  target?: string | null
  answer?: string | null
  /** Optional prefilled message for a `whatsapp` action. */
  message?: string | null
}

/** Site-wide context an action may need to resolve (e.g. the WhatsApp number). */
export type AssistantContext = {
  whatsapp?: string | null
}

/** The raw `assistant` group as stored on the SiteSettings global. */
export type AssistantSettingsInput = {
  enabled?: boolean | null
  greeting?: string | null
  actions?: RawAssistantAction[] | null
} | null | undefined

/** Copy shown when staff have not customised the assistant. */
export const ASSISTANT_DEFAULTS = {
  greeting: 'Hi 👋 How can we help you plan your trip? Pick an option below.',
} as const

/** A trimmed non-empty string, or null when blank/whitespace-only/absent. */
const nonEmpty = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

/**
 * Resolve a single raw CMS row into one render-ready action, or `null` if it
 * can't be shown. A `route`/`enquiry` action needs a label and an internal
 * path; a `faq` needs a label and an answer; a `whatsapp` needs a label and a
 * configured site WhatsApp number (from `context`). Rows missing their required
 * parts, and unrecognised action types, resolve to `null`.
 *
 * Kept separate so nested menus (a submenu's children) can reuse the exact same
 * per-row rules without duplicating them.
 */
function resolveLeafAction(
  raw: RawAssistantAction | null | undefined,
  context: AssistantContext,
): AssistantAction | null {
  const label = nonEmpty(raw?.label)
  if (!label) return null
  const emoji = nonEmpty(raw?.emoji)

  if (raw?.type === 'route') {
    const href = nonEmpty(raw.target)
    return href ? { type: 'route', label, emoji, href } : null
  }
  if (raw?.type === 'faq') {
    const answer = nonEmpty(raw.answer)
    return answer ? { type: 'faq', label, emoji, answer } : null
  }
  if (raw?.type === 'whatsapp') {
    const href = whatsappLink(context.whatsapp, nonEmpty(raw.message) ?? undefined)
    return href ? { type: 'whatsapp', label, emoji, href } : null
  }
  if (raw?.type === 'enquiry') {
    const href = nonEmpty(raw.target)
    return href ? { type: 'enquiry', label, emoji, href } : null
  }
  return null
}

/**
 * Map the raw CMS `actions` array into render-ready chips, dropping any that
 * can't be shown (see {@link resolveLeafAction}).
 */
export function resolveAssistantActions(
  input: RawAssistantAction[] | null | undefined,
  context: AssistantContext = {},
): AssistantAction[] {
  if (!input) return []
  const actions: AssistantAction[] = []
  for (const raw of input) {
    const action = resolveLeafAction(raw, context)
    if (action) actions.push(action)
  }
  return actions
}

/** Fold the raw CMS `assistant` group with code defaults into render config. */
export function resolveAssistant(
  input: AssistantSettingsInput,
  context: AssistantContext = {},
): AssistantConfig {
  return {
    enabled: input?.enabled ?? true,
    greeting: nonEmpty(input?.greeting) ?? ASSISTANT_DEFAULTS.greeting,
    actions: resolveAssistantActions(input?.actions, context),
  }
}

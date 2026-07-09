/**
 * The Marlo site assistant's identity (issue #31).
 *
 * The name and greeting are editable by staff in the SiteSettings global, but
 * the fields are optional and the global may predate them. `resolveAssistant`
 * folds those raw CMS values together with the code defaults below into the
 * single config the UI renders — so a blank field never shows an empty header,
 * and the assistant stays on unless it has been explicitly switched off.
 *
 * Kept pure (no Payload/database access) so the fallback policy is unit-tested
 * without a database; the server reads the raw group and passes it here.
 */

/** A quick-action chip, ready to render. Only `route` chips exist so far (#32). */
export type AssistantAction = {
  type: 'route'
  label: string
  emoji: string | null
  /** Internal path the chip navigates to, e.g. `/cruises`. */
  href: string
}

/** Config the `SiteAssistant` UI renders. */
export type AssistantConfig = {
  enabled: boolean
  name: string
  greeting: string
  actions: AssistantAction[]
}

/** A raw quick-action row as stored in the SiteSettings `assistant.actions` array. */
export type RawAssistantAction = {
  type?: string | null
  label?: string | null
  emoji?: string | null
  target?: string | null
}

/** The raw `assistant` group as stored on the SiteSettings global. */
export type AssistantSettingsInput = {
  enabled?: boolean | null
  name?: string | null
  greeting?: string | null
  actions?: RawAssistantAction[] | null
} | null | undefined

/** Copy shown when staff have not customised the assistant. */
export const ASSISTANT_DEFAULTS = {
  name: 'Marlo',
  greeting: "Marhaba! 👋 I'm Marlo, your Safar travel buddy. Tap around and I'll help you explore.",
} as const

/** A trimmed non-empty string, or null when blank/whitespace-only/absent. */
const nonEmpty = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

/**
 * Map the raw CMS `actions` array into render-ready chips, dropping any that
 * can't be shown. This slice renders only `route` chips (a label plus the
 * internal path they open); other types are ignored until their slice lands.
 */
export function resolveAssistantActions(
  input: RawAssistantAction[] | null | undefined,
): AssistantAction[] {
  if (!input) return []
  const actions: AssistantAction[] = []
  for (const raw of input) {
    if (raw?.type !== 'route') continue
    const label = nonEmpty(raw.label)
    const href = nonEmpty(raw.target)
    if (!label || !href) continue
    actions.push({ type: 'route', label, emoji: nonEmpty(raw.emoji), href })
  }
  return actions
}

/** Fold the raw CMS `assistant` group with code defaults into render config. */
export function resolveAssistant(input: AssistantSettingsInput): AssistantConfig {
  return {
    enabled: input?.enabled ?? true,
    name: nonEmpty(input?.name) ?? ASSISTANT_DEFAULTS.name,
    greeting: nonEmpty(input?.greeting) ?? ASSISTANT_DEFAULTS.greeting,
    actions: resolveAssistantActions(input?.actions),
  }
}

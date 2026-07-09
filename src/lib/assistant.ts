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

/** Config the `SiteAssistant` UI renders. */
export type AssistantConfig = {
  enabled: boolean
  name: string
  greeting: string
}

/** The raw `assistant` group as stored on the SiteSettings global. */
export type AssistantSettingsInput = {
  enabled?: boolean | null
  name?: string | null
  greeting?: string | null
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

/** Fold the raw CMS `assistant` group with code defaults into render config. */
export function resolveAssistant(input: AssistantSettingsInput): AssistantConfig {
  return {
    enabled: input?.enabled ?? true,
    name: nonEmpty(input?.name) ?? ASSISTANT_DEFAULTS.name,
    greeting: nonEmpty(input?.greeting) ?? ASSISTANT_DEFAULTS.greeting,
  }
}

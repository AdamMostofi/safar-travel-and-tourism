import type { Media } from '../payload-types'

/** A Media item shaped for rendering: a URL plus its accessibility alt text. */
export type MediaView = {
  url: string
  alt: string
}

/**
 * Maps a Payload upload relationship to a `MediaView`, or `null` when the
 * relationship is unset or unpopulated (queried at `depth: 0`, in which case it
 * is a bare id). Callers query at `depth >= 1` to get populated Media.
 */
export const toMediaView = (media: number | Media | null | undefined): MediaView | null => {
  if (!media || typeof media === 'number' || !media.url) return null
  return { url: media.url, alt: media.alt }
}

/** Maps a list of upload relationships, dropping any that aren't populated. */
export const toMediaViews = (
  items: (number | Media)[] | null | undefined,
): MediaView[] => (items ?? []).map(toMediaView).filter((m): m is MediaView => m !== null)

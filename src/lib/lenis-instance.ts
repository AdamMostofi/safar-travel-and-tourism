import type Lenis from 'lenis'

/**
 * A tiny client-side singleton holding the active Lenis instance, so controls
 * like the footer "Back to top" button can drive the smoothed scroll. Lenis owns
 * the scroll position, so a native anchor jump is reverted on the next frame —
 * these must call Lenis's own `scrollTo`. Using a module singleton (rather than
 * `window`) avoids clashing with Lenis's own global typings.
 */
let instance: Lenis | null = null

export const setLenis = (lenis: Lenis | null): void => {
  instance = lenis
}

export const getLenis = (): Lenis | null => instance

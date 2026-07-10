import { describe, expect, it } from 'vitest'

import { shouldNudge } from './assistantNudge'

/**
 * The site assistant launcher fires a one-time "peek/wave" nudge after a spell of
 * inactivity to draw the eye (issue #35). This pure gate encodes exactly when
 * that nudge may fire: only while the panel is closed, only if it hasn't
 * already nudged this session, and never for visitors who prefer reduced
 * motion. Kept pure so the policy is asserted without timers or a DOM.
 */
describe('shouldNudge', () => {
  it('fires when the panel is closed, it has not nudged yet, and motion is allowed', () => {
    expect(shouldNudge({ open: false, alreadyNudged: false, reducedMotion: false })).toBe(true)
  })

  it('never fires while the panel is open', () => {
    expect(shouldNudge({ open: true, alreadyNudged: false, reducedMotion: false })).toBe(false)
  })

  it('fires at most once per window', () => {
    expect(shouldNudge({ open: false, alreadyNudged: true, reducedMotion: false })).toBe(false)
  })

  it('is suppressed under reduced motion', () => {
    expect(shouldNudge({ open: false, alreadyNudged: false, reducedMotion: true })).toBe(false)
  })

  it('stays suppressed when several conditions apply at once', () => {
    expect(shouldNudge({ open: true, alreadyNudged: true, reducedMotion: true })).toBe(false)
  })
})

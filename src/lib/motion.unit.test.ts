import { describe, expect, it } from 'vitest'

import {
  MOTION_KINDS,
  isSuppressedUnderReducedMotion,
  kenBurnsEnabled,
  parallaxFactor,
  revealOffset,
  scrollExpandEnabled,
} from './motion'

/**
 * The reduced-motion policy is "graceful, not static" (brand brief / ADR-0004,
 * issue #3): normal visitors get full motion; OS "reduce motion" keeps gentle
 * fades but eases the large *vestibular* movements (parallax, Ken-Burns zoom,
 * scroll-pin). These pure functions encode that decision so every primitive
 * agrees on it and it can be asserted without a browser.
 */
describe('reduced-motion policy', () => {
  describe('isSuppressedUnderReducedMotion', () => {
    it('suppresses the large vestibular movements', () => {
      expect(isSuppressedUnderReducedMotion('parallax')).toBe(true)
      expect(isSuppressedUnderReducedMotion('ken-burns')).toBe(true)
      expect(isSuppressedUnderReducedMotion('scroll-pin')).toBe(true)
    })

    it('keeps the gentle movements so the site never goes fully static', () => {
      expect(isSuppressedUnderReducedMotion('fade')).toBe(false)
      expect(isSuppressedUnderReducedMotion('rise')).toBe(false)
      expect(isSuppressedUnderReducedMotion('hover-lift')).toBe(false)
      expect(isSuppressedUnderReducedMotion('counter')).toBe(false)
    })

    it('classifies every known motion kind', () => {
      for (const kind of MOTION_KINDS) {
        expect(typeof isSuppressedUnderReducedMotion(kind)).toBe('boolean')
      }
    })
  })

  describe('revealOffset', () => {
    it('rises from below when motion is allowed', () => {
      expect(revealOffset(false)).toBeGreaterThan(0)
    })

    it('keeps the fade but eases the travel to zero when reduced', () => {
      // Still animates (opacity handled by the primitive); only the movement eases out.
      expect(revealOffset(true)).toBe(0)
    })
  })

  describe('parallaxFactor', () => {
    it('moves layers at a fraction of scroll when allowed', () => {
      expect(parallaxFactor(0.3, false)).toBeCloseTo(0.3)
    })

    it('is fully disabled when reduced (vestibular)', () => {
      expect(parallaxFactor(0.3, true)).toBe(0)
    })
  })

  describe('kenBurnsEnabled', () => {
    it('drifts/zooms when allowed', () => {
      expect(kenBurnsEnabled(false)).toBe(true)
    })

    it('holds still when reduced (vestibular zoom)', () => {
      expect(kenBurnsEnabled(true)).toBe(false)
    })
  })

  describe('scrollExpandEnabled', () => {
    it('expands the hero media on scroll when allowed', () => {
      expect(scrollExpandEnabled(false)).toBe(true)
    })

    it('holds the hero fully expanded when reduced (scroll-driven)', () => {
      expect(scrollExpandEnabled(true)).toBe(false)
    })
  })
})

import { describe, expect, it } from 'vitest'

import { MAX_LOW_POWER_CORES, isLowConcurrency, shouldRenderLiveGlobe } from './globe'

/**
 * The home hero's live canvas globe (issue #26) is a desktop-first enhancement.
 * It must serve a static fallback for coarse (touch) pointers, low-power devices,
 * and visitors who prefer reduced motion. These pure decisions encode that so the
 * gating can be asserted without a browser or canvas.
 */
describe('isLowConcurrency', () => {
  it('flags a device at or below the low-power core threshold', () => {
    expect(isLowConcurrency(MAX_LOW_POWER_CORES)).toBe(true)
    expect(isLowConcurrency(2)).toBe(true)
  })

  it('clears a device with more cores than the threshold', () => {
    expect(isLowConcurrency(MAX_LOW_POWER_CORES + 1)).toBe(false)
    expect(isLowConcurrency(8)).toBe(false)
  })

  it('treats an unknown core count as capable (only known-low gates)', () => {
    expect(isLowConcurrency(undefined)).toBe(false)
  })
})

describe('shouldRenderLiveGlobe', () => {
  const capable = { coarsePointer: false, reducedMotion: false, hardwareConcurrency: 8 }

  it('runs the live globe for a fine-pointer, full-motion, multi-core desktop', () => {
    expect(shouldRenderLiveGlobe(capable)).toBe(true)
  })

  it('falls back on coarse (touch) pointers', () => {
    expect(shouldRenderLiveGlobe({ ...capable, coarsePointer: true })).toBe(false)
  })

  it('falls back under reduced motion (no ambient auto-rotation)', () => {
    expect(shouldRenderLiveGlobe({ ...capable, reducedMotion: true })).toBe(false)
  })

  it('falls back on low-power devices', () => {
    expect(shouldRenderLiveGlobe({ ...capable, hardwareConcurrency: 4 })).toBe(false)
  })

  it('runs when the core count is unknown but pointer/motion allow it', () => {
    expect(shouldRenderLiveGlobe({ ...capable, hardwareConcurrency: undefined })).toBe(true)
  })
})

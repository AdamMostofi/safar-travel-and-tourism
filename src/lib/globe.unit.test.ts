import { describe, expect, it } from 'vitest'

import {
  MAX_LOW_POWER_CORES,
  findMarkerAt,
  isFacingFront,
  isLowConcurrency,
  shouldRenderLiveGlobe,
} from './globe'

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

/**
 * Waypoint geometry (issue #28): d3 projects back-side points onto the same disc,
 * so markers must be culled to the near hemisphere before drawing/clicking, and
 * clicks resolved against the markers' last projected screen positions.
 */
describe('isFacingFront', () => {
  it('shows a point at the projection centre (facing the viewer)', () => {
    // With no rotation the screen centre is [0, 0]; a point there faces front.
    expect(isFacingFront([0, 0], [0, 0])).toBe(true)
  })

  it('hides the antipode of the projection centre (the far side)', () => {
    expect(isFacingFront([180, 0], [0, 0])).toBe(false)
    // Rotating the globe so [180, 0] is centred flips which side each faces.
    expect(isFacingFront([180, 0], [-180, 0])).toBe(true)
    expect(isFacingFront([0, 0], [-180, 0])).toBe(false)
  })

  it('tracks rotation — a point comes into view as its longitude is centred', () => {
    // Sydney (~151°E) is on the far side at rest, front once rotated to centre.
    expect(isFacingFront([151, -34], [0, 0])).toBe(false)
    expect(isFacingFront([151, -34], [-151, 34])).toBe(true)
  })
})

describe('findMarkerAt', () => {
  const markers = [
    { slug: 'turkey', x: 100, y: 100 },
    { slug: 'italy', x: 200, y: 150 },
  ]

  it('returns the marker whose disc contains the point', () => {
    expect(findMarkerAt(104, 97, markers, 14)?.slug).toBe('turkey')
  })

  it('returns null when the click misses every marker', () => {
    expect(findMarkerAt(160, 160, markers, 14)).toBeNull()
  })

  it('respects the radius — just outside the disc is a miss', () => {
    expect(findMarkerAt(115, 100, markers, 14)).toBeNull()
    expect(findMarkerAt(113, 100, markers, 14)?.slug).toBe('turkey')
  })

  it('prefers the last (topmost) marker when discs overlap', () => {
    const overlapping = [
      { slug: 'under', x: 100, y: 100 },
      { slug: 'over', x: 105, y: 100 },
    ]
    expect(findMarkerAt(102, 100, overlapping, 14)?.slug).toBe('over')
  })
})

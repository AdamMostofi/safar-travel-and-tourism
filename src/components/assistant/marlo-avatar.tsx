import { cn } from '@/lib/utils'

/**
 * Marlo — the Safar site-assistant mascot (issue #30): a friendly whale drawn
 * in the "Sea & Sand" ocean-teal palette so it reads as native to the brand.
 * Pure presentational SVG, so it stays crisp from the small panel header up to
 * the corner launcher. Decorative (`aria-hidden`) — the surrounding launcher
 * button and dialog carry the accessible labels.
 *
 * The fills are the "Sea & Sand" brand tokens by hex (ADR-0004): body `sea`
 * #0e7490 with a `sea`-dark #0b5e78 tail, `sky` #7dd3fc spout, `gold`/mint
 * #5eead4 blush, a soft `sky`/cream belly #bfe6fb, and deep-ink #12323f eyes.
 * A multi-fill illustration can't ride a single `currentColor`, so the tokens
 * live inline here rather than as Tailwind utilities.
 *
 * With `blink`, the eyes carry the `.marlo-eye` class so they blink periodically
 * (issue #35) — used on the corner launcher, not the static panel header.
 */
export function MarloAvatar({ className, blink }: { className?: string; blink?: boolean }) {
  const eyeClass = blink ? 'marlo-eye' : undefined
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className={cn('h-11 w-11', className)}
    >
      {/* Water spout */}
      <g stroke="#7dd3fc" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M50 22 v-9" />
        <path d="M42 24 l-4 -7" />
        <path d="M58 24 l4 -7" />
      </g>
      {/* Tail */}
      <path d="M80 52 q14 -9 18 -15 q1 11 -5 17 q7 4 4 13 q-10 -4 -17 -9 z" fill="#0b5e78" />
      {/* Body + belly */}
      <ellipse cx="47" cy="60" rx="37" ry="30" fill="#0e7490" />
      <path d="M13 64 Q47 98 81 64 Q47 82 13 64 Z" fill="#bfe6fb" />
      {/* Blush */}
      <ellipse cx="27" cy="66" rx="4.4" ry="2.8" fill="#5eead4" opacity="0.75" />
      <ellipse cx="65" cy="66" rx="4.4" ry="2.8" fill="#5eead4" opacity="0.75" />
      {/* Eyes — each grouped so it can blink as a unit */}
      <g className={eyeClass}>
        <circle cx="36" cy="56" r="8.4" fill="#fff" />
        <circle cx="36.5" cy="57" r="4.2" fill="#12323f" />
        <circle cx="38.7" cy="54.8" r="1.9" fill="#fff" />
      </g>
      <g className={eyeClass}>
        <circle cx="59" cy="56" r="8.4" fill="#fff" />
        <circle cx="59.5" cy="57" r="4.2" fill="#12323f" />
        <circle cx="61.7" cy="54.8" r="1.9" fill="#fff" />
      </g>
      {/* Smile */}
      <path
        d="M41 69 q6 7 13 0"
        stroke="#12323f"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}

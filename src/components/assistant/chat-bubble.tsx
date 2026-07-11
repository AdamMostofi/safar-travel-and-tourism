import { cn } from '@/lib/utils'

/**
 * The Safar site-assistant launcher icon: a friendly chat bubble in the Ocean
 * Breeze palette — a sky-to-sea gradient body with deep-ink typing dots. The
 * gradient is `userSpaceOnUse` spanning the whole icon so the body and its tail
 * share one continuous fill (no seam where they meet). Pure presentational SVG,
 * decorative (`aria-hidden`); the launcher button carries the accessible label.
 */
export function ChatBubble({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className={cn('h-10 w-10', className)}
    >
      <defs>
        <linearGradient id="safar-bubble" x1="24" y1="8" x2="24" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#7dd3fc" />
          <stop offset="1" stopColor="#0e7490" />
        </linearGradient>
      </defs>
      {/* Bubble body + tail as one continuous shape. */}
      <path
        d="M15 9 H33 A9 9 0 0 1 42 18 V23 A9 9 0 0 1 33 32 H21 L14 40 L15.5 32 A9 9 0 0 1 6 23 V18 A9 9 0 0 1 15 9 Z"
        fill="url(#safar-bubble)"
      />
      {/* Typing dots */}
      <circle cx="17" cy="20.5" r="2.6" fill="#12323f" />
      <circle cx="24" cy="20.5" r="2.6" fill="#12323f" />
      <circle cx="31" cy="20.5" r="2.6" fill="#12323f" />
    </svg>
  )
}

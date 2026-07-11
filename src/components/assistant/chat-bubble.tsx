import { cn } from '@/lib/utils'

/**
 * The Safar site-assistant launcher icon: a friendly chat bubble in the Ocean
 * Breeze palette — a sky-to-sea gradient body with deep-ink typing dots. Pure
 * presentational SVG so it stays crisp at any size. Decorative (`aria-hidden`);
 * the surrounding launcher button and dialog carry the accessible labels.
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
        <linearGradient id="safar-bubble" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7dd3fc" />
          <stop offset="1" stopColor="#0e7490" />
        </linearGradient>
      </defs>
      {/* Bubble body + tail (same fill, so they read as one shape) */}
      <rect x="6" y="9" width="36" height="24" rx="8" fill="url(#safar-bubble)" />
      <path d="M15 31 L11 41 L26 31 Z" fill="url(#safar-bubble)" />
      {/* Typing dots */}
      <circle cx="17" cy="20.5" r="2.7" fill="#12323f" />
      <circle cx="24" cy="20.5" r="2.7" fill="#12323f" />
      <circle cx="31" cy="20.5" r="2.7" fill="#12323f" />
    </svg>
  )
}

import { cn } from '@/lib/utils'

/**
 * The Safar signature mark (issue #10): a rising sun over two waves — the
 * "Sea & Sand" journey motif, chosen from the explored directions (rising sun /
 * wave / compass / journey-path). Drawn in `currentColor` so it inherits the
 * surrounding text colour, reading as Deep Sea ink on light surfaces and Cream
 * on the dark footer. Pure SVG, so it stays crisp at favicon and hero sizes.
 */
export function SafarMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Safar"
      className={cn('h-8 w-8', className)}
    >
      {/* Rising sun */}
      <circle cx="16" cy="13" r="6" fill="currentColor" />
      {/* Two waves cresting beneath it */}
      <path
        d="M3 22c2.2 0 2.2-2.4 4.3-2.4S9.5 22 11.7 22s2.2-2.4 4.3-2.4S18.2 22 20.3 22s2.2-2.4 4.3-2.4S26.8 22 29 22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 27c2.2 0 2.2-2.4 4.3-2.4S9.5 27 11.7 27s2.2-2.4 4.3-2.4S18.2 27 20.3 27s2.2-2.4 4.3-2.4S26.8 27 29 27"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

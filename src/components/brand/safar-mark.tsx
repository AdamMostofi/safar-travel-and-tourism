import { cn } from '@/lib/utils'

/** The Safar brand blue (the real logo's sky-blue spire). */
const SAFAR_BLUE = '#3a9bd5'

/**
 * The Safar signature mark: the real business logo — a sky-blue upward spire
 * with a white passenger jet climbing out of it (nose at the apex, swept wings,
 * twin contrails splitting the base). Recreated as pure inline SVG from the mark
 * on safartravelandtourism.com, so it stays crisp from favicon to hero sizes.
 *
 * Unlike the wordmark, the mark carries its own brand colours (blue spire +
 * white plane) rather than `currentColor`, so it reads correctly on both the
 * light header and the dark footer.
 */
export function SafarMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Safar"
      className={cn('h-8 w-8', className)}
    >
      {/* Spire / arrowhead */}
      <path
        d="M24 4 C21.5 13 16 30 8.5 44 L21 44 C21.5 40 22 37 24 33.5 C26 37 26.5 40 27 44 L39.5 44 C32 30 26.5 13 24 4 Z"
        fill={SAFAR_BLUE}
      />
      {/* White jet climbing out of the spire */}
      <g fill="#ffffff">
        <path d="M24 9 C23 10 22.7 12.5 22.7 16 L22.7 27.5 C22.7 29.5 23.2 30.6 24 31.2 C24.8 30.6 25.3 29.5 25.3 27.5 L25.3 16 C25.3 12.5 25 10 24 9 Z" />
        <path d="M22.7 15.5 L12.5 25 L14 25.7 L22.7 20.5 Z" />
        <path d="M25.3 15.5 L35.5 25 L34 25.7 L25.3 20.5 Z" />
        <path d="M22.7 26.3 L18.8 30 L19.9 30.6 L22.7 28.7 Z" />
        <path d="M25.3 26.3 L29.2 30 L28.1 30.6 L25.3 28.7 Z" />
      </g>
    </svg>
  )
}

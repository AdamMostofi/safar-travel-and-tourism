import { SafarMark } from '@/components/brand/safar-mark'
import { cn } from '@/lib/utils'

/**
 * The Safar lockup: the signature {@link SafarMark} beside the "Safar" wordmark
 * (display serif) and its Arabic سفر. Everything is drawn in `currentColor`, so
 * one component serves both themes — set `text-sea`/`text-ink` on the light
 * header and `text-cream` on the dark footer. Replaces the old white wordmark.
 */
export function SafarLogo({
  className,
  markClassName,
  showArabic = true,
}: {
  className?: string
  markClassName?: string
  showArabic?: boolean
}) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <SafarMark className={cn('h-8 w-8', markClassName)} />
      <span className="font-display text-2xl leading-none tracking-tight">
        Safar
        {showArabic && <span className="ml-2 text-lg opacity-70">سفر</span>}
      </span>
    </span>
  )
}

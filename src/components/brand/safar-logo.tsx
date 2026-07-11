import { SafarMark } from '@/components/brand/safar-mark'
import { cn } from '@/lib/utils'

/**
 * The Safar lockup: the signature {@link SafarMark} (the real brand logo, which
 * carries its own blue/white) beside the "Safar" wordmark (display serif) and
 * its Arabic سفر. The wordmark is drawn in `currentColor`, so one component
 * serves both themes — set `text-sea`/`text-ink` on the light header and
 * `text-cream` on the dark footer while the mark keeps its brand colours.
 *
 * On light surfaces the mark's white plane blends in, so `badged` sits it on a
 * deep-slate tile (as it already reads on the dark footer) to make the wings
 * pop. The footer keeps the bare mark.
 */
export function SafarLogo({
  className,
  markClassName,
  showArabic = true,
  badged = false,
}: {
  className?: string
  markClassName?: string
  showArabic?: boolean
  badged?: boolean
}) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      {badged ? (
        <span className="inline-flex items-center justify-center rounded-xl bg-ink p-1.5 shadow-soft ring-1 ring-sky/20">
          <SafarMark className={cn('h-7 w-7', markClassName)} />
        </span>
      ) : (
        <SafarMark className={cn('h-8 w-8', markClassName)} />
      )}
      <span className="font-display text-2xl leading-none tracking-tight">
        Safar
        {showArabic && <span className="ml-2 text-lg opacity-70">سفر</span>}
      </span>
    </span>
  )
}

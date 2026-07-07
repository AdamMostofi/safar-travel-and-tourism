import { Button, type ButtonProps } from '@/components/ui/button'

type WhatsAppButtonProps = {
  /** A prebuilt `wa.me` href (see `@/lib/contact`). */
  href: string
  children: React.ReactNode
  size?: ButtonProps['size']
  className?: string
}

/**
 * The "message us on WhatsApp" CTA — an outline Button linking out to a `wa.me`
 * deep link in a new tab. Wraps the `target`/`rel` boilerplate so the hero and
 * conversion CTAs (which differ only in label and colour) don't repeat it.
 */
export function WhatsAppButton({ href, children, size = 'lg', className }: WhatsAppButtonProps) {
  return (
    <Button asChild size={size} variant="outline" className={className}>
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    </Button>
  )
}

import { SafarMark } from '@/components/brand/safar-mark'

/**
 * The Safar airplane mark, shown as the admin sidebar/nav icon. A server
 * component — no interactivity. Tailwind utilities aren't loaded in the admin
 * bundle, so the size comes from `.safar-admin-icon` in `custom.scss`.
 */
export function Icon() {
  return (
    <span className="safar-admin-icon">
      <SafarMark className="safar-admin-icon__mark" />
    </span>
  )
}

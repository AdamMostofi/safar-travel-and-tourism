import { SafarMark } from '@/components/brand/safar-mark'

/**
 * The Safar lockup (mark + wordmark) shown on the admin login screen. A server
 * component. Sizing and the serif wordmark come from `.safar-admin-logo*` in
 * `custom.scss`, since the admin bundle doesn't include the frontend Tailwind
 * build.
 */
export function Logo() {
  return (
    <span className="safar-admin-logo">
      <span className="safar-admin-logo__badge">
        <SafarMark className="safar-admin-logo__mark" />
      </span>
      <span className="safar-admin-logo__word">Safar</span>
    </span>
  )
}

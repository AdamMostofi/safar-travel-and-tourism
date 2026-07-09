'use client'

import { useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { X } from 'lucide-react'

import { MarloAvatar } from '@/components/assistant/marlo-avatar'
import type { AssistantAction } from '@/lib/assistant'
import { trapTabIndex } from '@/lib/focusTrap'
import { cn } from '@/lib/utils'

/** Elements that can receive keyboard focus inside the panel (for the trap). */
const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

type SiteAssistantProps = {
  /** Assistant name shown in the panel header (already defaulted upstream). */
  name: string
  /** Opening message shown in the panel (already defaulted upstream). */
  greeting: string
  /** Quick-action chips (already resolved/filtered upstream). */
  actions: AssistantAction[]
}

/**
 * Marlo — the floating site assistant (issue #30, #31). A whale-mascot launcher
 * fixed to the bottom-right corner opens a small dialog panel with a greeting.
 * The name and greeting come from the SiteSettings global (with code defaults
 * applied in `resolveAssistant`); the enabled toggle is honoured by the caller,
 * which does not mount this component when the assistant is switched off.
 *
 * Behaves like a non-modal dialog: opens on click, closes on click again, on
 * Escape, or on an outside click. While open it traps Tab focus (see
 * `trapTabIndex`) and returns focus to the launcher when dismissed by keyboard.
 * Open/close is animated with Motion and collapses to a plain fade under
 * `prefers-reduced-motion`. The panel is width-capped so it never overflows a
 * narrow (mobile) viewport.
 */
export function SiteAssistant({ name, greeting, actions }: SiteAssistantProps) {
  const [open, setOpen] = useState(false)
  const reducedMotion = useReducedMotion()
  const launcherRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const panelId = useId()
  const titleId = useId()

  const closeLabel = `Close ${name}`

  /** Close and hand focus back to the launcher (keyboard-dismiss paths). */
  const closeToLauncher = () => {
    setOpen(false)
    launcherRef.current?.focus()
  }

  // Move focus into the panel when it opens.
  useEffect(() => {
    if (!open) return
    const first = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)
    first?.focus()
  }, [open])

  // Escape closes; Tab / Shift+Tab are trapped within the panel.
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeToLauncher()
        return
      }
      if (event.key === 'Tab' && panelRef.current) {
        const els = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE))
        const currentIndex = els.indexOf(document.activeElement as HTMLElement)
        const target = trapTabIndex({ count: els.length, currentIndex, shiftKey: event.shiftKey })
        if (target !== null) {
          event.preventDefault()
          els[target]?.focus()
        }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  // An outside click closes the panel (without stealing focus back).
  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (panelRef.current?.contains(target) || launcherRef.current?.contains(target)) return
      // If focus was still inside the panel, it would drop to <body> on unmount —
      // hand it back to the launcher. If the click moved focus elsewhere, leave it.
      const focusWasInPanel = panelRef.current?.contains(document.activeElement)
      setOpen(false)
      if (focusWasInPanel) launcherRef.current?.focus()
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            id={panelId}
            role="dialog"
            aria-labelledby={titleId}
            initial={{ opacity: 0, y: reducedMotion ? 0 : 12, scale: reducedMotion ? 1 : 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reducedMotion ? 0 : 12, scale: reducedMotion ? 1 : 0.96 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'bottom right' }}
            className="w-[min(20rem,calc(100vw-2.5rem))] origin-bottom-right rounded-2xl border border-sky/15 bg-ink p-4 text-cream shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-sky/15 pb-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sea/25">
                <MarloAvatar className="h-8 w-8" />
              </span>
              <div className="min-w-0 flex-1">
                <p id={titleId} className="text-sm font-bold leading-tight">
                  {name}
                </p>
                <span className="flex items-center gap-1.5 text-xs text-sky">
                  <span className="h-2 w-2 rounded-full bg-gold" aria-hidden="true" />
                  online · here to help
                </span>
              </div>
              <button
                type="button"
                onClick={closeToLauncher}
                aria-label={closeLabel}
                className="shrink-0 rounded-full p-1.5 text-sky transition-colors hover:bg-sky/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <p className="pt-3 text-sm leading-relaxed text-cream/90">{greeting}</p>
            {actions.length > 0 && (
              <ul className="flex flex-wrap gap-2 pt-3">
                {actions.map((action) => (
                  <li key={`${action.type}:${action.href}:${action.label}`}>
                    <Link
                      href={action.href}
                      onClick={() => setOpen(false)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-sky/25 bg-sky/10 px-3 py-1.5 text-xs font-semibold text-cream transition-colors hover:bg-sky/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky"
                    >
                      {action.emoji && <span aria-hidden="true">{action.emoji}</span>}
                      {action.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        ref={launcherRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? closeLabel : `Open ${name}, the Safar travel assistant`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        className={cn(
          'relative flex h-16 w-16 items-center justify-center rounded-full border border-sea/10 bg-cream shadow-lg transition-transform',
          'hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea focus-visible:ring-offset-2',
        )}
      >
        <MarloAvatar className="h-11 w-11" />
        <span
          className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-cream bg-pine"
          aria-hidden="true"
        />
      </button>
    </div>
  )
}

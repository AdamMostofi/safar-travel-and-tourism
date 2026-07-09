'use client'

import { useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowLeft, X } from 'lucide-react'

import { MarloAvatar } from '@/components/assistant/marlo-avatar'
import type { AssistantAction } from '@/lib/assistant'
import { shouldNudge } from '@/lib/assistantNudge'
import { trapTabIndex } from '@/lib/focusTrap'
import { cn } from '@/lib/utils'

/** Idle time before the launcher's one-time attention nudge fires (ms). */
const NUDGE_AFTER_MS = 12_000

/** Elements that can receive keyboard focus inside the panel (for the trap). */
const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

/** Shared chip styling for route links and FAQ buttons. */
const CHIP_CLASS =
  'inline-flex items-center gap-1.5 rounded-full border border-sky/25 bg-sky/10 px-3 py-1.5 text-xs font-semibold text-cream transition-colors hover:bg-sky/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky'

type FaqAction = Extract<AssistantAction, { type: 'faq' }>

/** A stable key per action, used for React lists and focus-return bookkeeping. */
const actionKey = (action: AssistantAction) =>
  action.type === 'faq' ? `faq:${action.label}` : `${action.type}:${action.href}:${action.label}`

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
  // The FAQ whose answer is currently expanded in place, or null for the menu.
  const [expanded, setExpanded] = useState<FaqAction | null>(null)
  // Delight (#35): a first-visit pulse and a one-time attention nudge.
  const [firstVisit, setFirstVisit] = useState(false)
  const [nudging, setNudging] = useState(false)
  const hasNudgedRef = useRef(false)
  const reducedMotion = useReducedMotion()
  const launcherRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const backButtonRef = useRef<HTMLButtonElement>(null)
  // FAQ chip nodes by key, so focus can return to the one that opened an answer.
  const chipRefs = useRef<Map<string, HTMLElement>>(new Map())
  const returnKeyRef = useRef<string | null>(null)
  const panelId = useId()
  const titleId = useId()

  const closeLabel = `Close ${name}`

  /** Close and hand focus back to the launcher (keyboard-dismiss paths). */
  const closeToLauncher = () => {
    setOpen(false)
    launcherRef.current?.focus()
  }

  const openFaq = (action: FaqAction, key: string) => {
    returnKeyRef.current = key
    setExpanded(action)
  }

  // Move focus into the panel when it opens.
  useEffect(() => {
    if (!open) return
    const first = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)
    first?.focus()
  }, [open])

  // Reset to the menu whenever the panel closes, so it reopens on the chip list
  // (and drop any pending focus-return so the next open starts at the top).
  useEffect(() => {
    if (!open) {
      setExpanded(null)
      returnKeyRef.current = null
    }
  }, [open])

  // Manage focus across the menu ↔ answer transition: into the Back button when
  // an answer opens, back to the originating chip when it collapses.
  useEffect(() => {
    if (!open) return
    if (expanded) {
      backButtonRef.current?.focus()
    } else if (returnKeyRef.current) {
      chipRefs.current.get(returnKeyRef.current)?.focus()
      returnKeyRef.current = null
    }
  }, [expanded, open])

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

  // First-visit pulse: signal the assistant is interactive the first time this
  // browser sees it. Only READ the flag here — persisting it on the retire path
  // (below) keeps this idempotent under React StrictMode's double-mount.
  useEffect(() => {
    try {
      if (!window.localStorage.getItem('marlo-seen')) setFirstVisit(true)
    } catch {
      // localStorage unavailable (private mode) — simply skip the pulse.
    }
  }, [])

  // Retire the pulse once the panel is opened or after a short while, and only
  // then mark this browser as having seen the assistant.
  useEffect(() => {
    if (!firstVisit) return
    const done = () => {
      setFirstVisit(false)
      try {
        window.localStorage.setItem('marlo-seen', '1')
      } catch {
        // ignore — a missing flag just means the pulse may show again
      }
    }
    if (open) {
      done()
      return
    }
    const timer = setTimeout(done, 8_000)
    return () => clearTimeout(timer)
  }, [firstVisit, open])

  // One-time attention nudge: after a spell of inactivity (and only while
  // closed, not yet nudged, motion allowed) the launcher gives a brief wave.
  useEffect(() => {
    if (reducedMotion) return
    let fireTimer: ReturnType<typeof setTimeout>
    let clearTimer: ReturnType<typeof setTimeout>
    const schedule = () => {
      clearTimeout(fireTimer)
      fireTimer = setTimeout(() => {
        if (shouldNudge({ open, alreadyNudged: hasNudgedRef.current, reducedMotion: false })) {
          hasNudgedRef.current = true
          setNudging(true)
          clearTimer = setTimeout(() => setNudging(false), 1_400)
        }
      }, NUDGE_AFTER_MS)
    }
    const onActivity = () => {
      if (!hasNudgedRef.current) schedule()
    }
    schedule()
    const events: (keyof WindowEventMap)[] = ['pointermove', 'keydown', 'scroll', 'touchstart']
    events.forEach((event) => window.addEventListener(event, onActivity, { passive: true }))
    return () => {
      clearTimeout(fireTimer)
      clearTimeout(clearTimer)
      events.forEach((event) => window.removeEventListener(event, onActivity))
    }
  }, [open, reducedMotion])

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
            <motion.div
              key={expanded ? 'answer' : 'menu'}
              initial={{ opacity: 0, x: reducedMotion ? 0 : 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="pt-3"
            >
              {expanded ? (
                <div>
                  <button
                    ref={backButtonRef}
                    type="button"
                    onClick={() => setExpanded(null)}
                    className="mb-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold text-sky transition-colors hover:bg-sky/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                    Back
                  </button>
                  <p className="text-sm font-bold text-cream">{expanded.label}</p>
                  <p className="whitespace-pre-line pt-1.5 text-sm leading-relaxed text-cream/90">
                    {expanded.answer}
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-sm leading-relaxed text-cream/90">{greeting}</p>
                  {actions.length > 0 && (
                    <ul className="flex flex-wrap gap-2 pt-3">
                      {actions.map((action) => {
                        const key = actionKey(action)
                        const inner = (
                          <>
                            {action.emoji && <span aria-hidden="true">{action.emoji}</span>}
                            {action.label}
                          </>
                        )
                        return (
                          <li key={key}>
                            {action.type === 'faq' ? (
                              <button
                                type="button"
                                ref={(el) => {
                                  if (el) chipRefs.current.set(key, el)
                                  else chipRefs.current.delete(key)
                                }}
                                onClick={() => openFaq(action, key)}
                                className={CHIP_CLASS}
                              >
                                {inner}
                              </button>
                            ) : action.type === 'whatsapp' ? (
                              <a
                                href={action.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setOpen(false)}
                                className={CHIP_CLASS}
                              >
                                {inner}
                              </a>
                            ) : (
                              <Link
                                href={action.href}
                                onClick={() => setOpen(false)}
                                className={CHIP_CLASS}
                              >
                                {inner}
                              </Link>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        {/* Peek bubble — the "wave" nudge's spoken half. Decorative. */}
        <AnimatePresence>
          {nudging && (
            <motion.div
              initial={{ opacity: 0, x: 8, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 8, scale: 0.9 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: 'right center' }}
              className="absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-2xl bg-ink px-3 py-2 text-xs font-semibold text-cream shadow-lg"
              aria-hidden="true"
            >
              Need a hand? 👋
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
          {firstVisit && !open && !reducedMotion && (
            <span
              className="marlo-pulse pointer-events-none absolute inset-0 rounded-full border-2 border-sea/50"
              aria-hidden="true"
            />
          )}
          <MarloAvatar
            className={cn('h-11 w-11', nudging ? 'marlo-wave' : !open && 'marlo-bob')}
            blink={!open}
          />
          <span
            className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-cream bg-pine"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  )
}

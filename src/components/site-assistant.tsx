'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowLeft, X } from 'lucide-react'

import type { AssistantAction, AssistantCategory } from '@/lib/assistant'
import { groupAssistantActions } from '@/lib/assistant'
import { shouldNudge } from '@/lib/assistantNudge'
import { trapTabIndex } from '@/lib/focusTrap'
import { cn } from '@/lib/utils'
import { WhaleAvatar } from './assistant/whale-avatar'

/** Idle time before the launcher's one-time attention nudge fires (ms). */
const NUDGE_AFTER_MS = 12_000

/** Per-character delay of the terminal typing effect (ms). */
const TYPE_SPEED_MS = 26

/** The shell prompt shown before an echoed command / question. */
const PROMPT = 'visitor@safar:~$'

/** Elements that can receive keyboard focus inside the panel (for the trap). */
const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

/** Shared styling for a terminal menu row — a full-width command line. */
const ROW_CLASS =
  'flex w-full items-center gap-2 rounded-md border border-sky/20 bg-sky/5 px-2.5 py-1.5 text-left font-mono text-xs text-cream transition-colors hover:border-sky/50 hover:bg-sky/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky'

type FaqAction = Extract<AssistantAction, { type: 'faq' }>

/** A stable key per action, used for React lists and focus-return bookkeeping. */
const actionKey = (action: AssistantAction) =>
  action.type === 'faq' ? `faq:${action.label}` : `${action.type}:${action.href}:${action.label}`

/**
 * A terminal-style typewriter. Reveals `text` one character at a time while
 * `enabled`; when disabled (e.g. `prefers-reduced-motion`) it shows the whole
 * string at once. Restarts whenever the target text changes.
 */
function useTypewriter(text: string, enabled: boolean) {
  const [count, setCount] = useState(enabled ? 0 : text.length)
  useEffect(() => {
    if (!enabled) {
      setCount(text.length)
      return
    }
    setCount(0)
    let i = 0
    const id = setInterval(() => {
      i += 1
      setCount(i)
      if (i >= text.length) clearInterval(id)
    }, TYPE_SPEED_MS)
    return () => clearInterval(id)
  }, [text, enabled])
  return { shown: text.slice(0, count), done: count >= text.length }
}

type SiteAssistantProps = {
  /** Opening message shown at the root of the menu (already defaulted upstream). */
  greeting: string
  /** Quick-action chips (already resolved/filtered upstream). */
  actions: AssistantAction[]
}

/**
 * The floating site assistant. A whale launcher fixed to the bottom-right
 * corner opens a small terminal-style dialog. The panel opens on a short menu
 * of intent commands (grouped from the configured actions by
 * `groupAssistantActions`); choosing one echoes it like a typed shell command
 * and then reveals that command's options. FAQ answers type out as the shell's
 * response. The assistant has no persona name.
 *
 * Behaves like a non-modal dialog: opens on click, closes on click again, on
 * Escape, or on an outside click. While open it traps Tab focus (see
 * `trapTabIndex`) and manages focus across the menu ↔ drill-down transitions,
 * returning focus to the launcher when dismissed by keyboard. Open/close is
 * animated with Motion and the typing collapses to instant text under
 * `prefers-reduced-motion`. The panel is width-capped so it never overflows a
 * narrow (mobile) viewport.
 */
export function SiteAssistant({ greeting, actions }: SiteAssistantProps) {
  const categories = useMemo(() => groupAssistantActions(actions), [actions])

  const [open, setOpen] = useState(false)
  // The drilled-in category (null = root menu) and, within a category, the FAQ
  // answer currently expanded.
  const [category, setCategory] = useState<AssistantCategory | null>(null)
  const [expanded, setExpanded] = useState<FaqAction | null>(null)
  // Whether the freshly entered category should type its command out. Cleared
  // when returning from an answer so the option list reappears instantly.
  const [animateCommand, setAnimateCommand] = useState(false)
  // Delight: a first-visit pulse and a one-time attention nudge.
  const [firstVisit, setFirstVisit] = useState(false)
  const [nudging, setNudging] = useState(false)
  const hasNudgedRef = useRef(false)
  const reducedMotion = useReducedMotion()
  const launcherRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const backButtonRef = useRef<HTMLButtonElement>(null)
  // Menu-row nodes by key, so focus can return to the row that drilled in.
  const chipRefs = useRef<Map<string, HTMLElement>>(new Map())
  // What to focus after the next render: 'back', a chip key, or null.
  const focusTargetRef = useRef<'back' | string | null>(null)
  const panelId = useId()

  const closeLabel = 'Close the assistant'

  /** Close and hand focus back to the launcher (keyboard-dismiss paths). */
  const closeToLauncher = () => {
    setOpen(false)
    launcherRef.current?.focus()
  }

  const enterCategory = (next: AssistantCategory) => {
    setCategory(next)
    setExpanded(null)
    setAnimateCommand(true)
    focusTargetRef.current = 'back'
  }

  const openFaq = (action: FaqAction) => {
    setExpanded(action)
    focusTargetRef.current = 'back'
  }

  /** Step back one level: answer → category, or category → root. */
  const goBack = () => {
    if (expanded) {
      const key = actionKey(expanded)
      setExpanded(null)
      setAnimateCommand(false)
      focusTargetRef.current = key
    } else if (category) {
      const key = `cat:${category.type}`
      setCategory(null)
      focusTargetRef.current = key
    }
  }

  // The line currently being typed: a FAQ answer takes precedence over a freshly
  // entered category's command; the root menu types nothing.
  const typingText = expanded
    ? expanded.answer
    : category && animateCommand
      ? category.command
      : ''
  const typingEnabled = open && !reducedMotion && typingText !== ''
  const { shown, done } = useTypewriter(typingText, typingEnabled)
  // Options appear once a freshly typed command has finished (instant otherwise).
  const showOptions = !expanded && category !== null && (!animateCommand || done)

  // Move focus into the panel when it opens.
  useEffect(() => {
    if (!open) return
    const first = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)
    first?.focus()
  }, [open])

  // Reset to the root menu whenever the panel closes, so it reopens at the top.
  useEffect(() => {
    if (!open) {
      setCategory(null)
      setExpanded(null)
      setAnimateCommand(false)
      focusTargetRef.current = null
    }
  }, [open])

  // Apply any pending focus move after a navigation re-renders the panel.
  useEffect(() => {
    if (!open) return
    const target = focusTargetRef.current
    if (!target) return
    focusTargetRef.current = null
    if (target === 'back') backButtonRef.current?.focus()
    else chipRefs.current.get(target)?.focus()
  }, [open, category, expanded])

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
      if (!window.localStorage.getItem('assistant-seen')) setFirstVisit(true)
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
        window.localStorage.setItem('assistant-seen', '1')
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
  // closed, not yet nudged, motion allowed) the launcher gives a brief nudge
  // (a scale pulse) with a peek bubble.
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

  /** A blinking block caret shown at the end of a line still being typed. */
  const caret = <span className="assistant-caret text-sky">▋</span>

  const viewKey = expanded ? `answer:${actionKey(expanded)}` : category ? `cat:${category.type}` : 'root'

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            id={panelId}
            role="dialog"
            aria-label="Safar assistant"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 12, scale: reducedMotion ? 1 : 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reducedMotion ? 0 : 12, scale: reducedMotion ? 1 : 0.96 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'bottom right' }}
            className="w-[min(20rem,calc(100vw-2.5rem))] origin-bottom-right rounded-xl border border-sky/20 bg-ink p-3 font-mono text-cream shadow-2xl"
          >
            <div className="flex items-center gap-2 border-b border-sky/15 pb-2.5">
              {/* Terminal titlebar */}
              <span className="flex shrink-0 gap-1.5" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
              </span>
              <p className="min-w-0 flex-1 truncate text-xs text-cream/70">safar@assistant: ~</p>
              <button
                type="button"
                onClick={closeToLauncher}
                aria-label={closeLabel}
                className="shrink-0 rounded p-1 text-sky transition-colors hover:bg-sky/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <motion.div
              key={viewKey}
              initial={{ opacity: 0, x: reducedMotion ? 0 : 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="pt-3"
            >
              {category === null ? (
                /* Root: greeting + the intent commands. */
                <>
                  <p className="text-sm leading-relaxed text-cream/90">
                    <span className="text-gold" aria-hidden="true">
                      ${' '}
                    </span>
                    {greeting}
                  </p>
                  {categories.length > 0 && (
                    <ul className="flex flex-col gap-2 pt-3">
                      {categories.map((cat) => {
                        const key = `cat:${cat.type}`
                        return (
                          <li key={key}>
                            <button
                              type="button"
                              ref={(el) => {
                                if (el) chipRefs.current.set(key, el)
                                else chipRefs.current.delete(key)
                              }}
                              onClick={() => enterCategory(cat)}
                              className={ROW_CLASS}
                            >
                              <span className="text-gold" aria-hidden="true">
                                {'>'}
                              </span>
                              {cat.label}
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </>
              ) : expanded ? (
                /* A FAQ answer: the question echoed, then the typed response. */
                <div>
                  <button
                    ref={backButtonRef}
                    type="button"
                    onClick={goBack}
                    className="mb-2 inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-sky transition-colors hover:bg-sky/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                    back
                  </button>
                  <p className="text-sm text-cream">
                    <span className="text-gold" aria-hidden="true">
                      {PROMPT}{' '}
                    </span>
                    {expanded.label}
                  </p>
                  <p className="whitespace-pre-line pt-1.5 text-sm leading-relaxed text-cream/90">
                    {shown}
                    {!done && caret}
                  </p>
                </div>
              ) : (
                /* A category: the chosen command echoed, then its options. */
                <div>
                  <button
                    ref={backButtonRef}
                    type="button"
                    onClick={goBack}
                    className="mb-2 inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-sky transition-colors hover:bg-sky/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                    back
                  </button>
                  <p className="text-sm text-cream">
                    <span className="text-gold" aria-hidden="true">
                      {PROMPT}{' '}
                    </span>
                    {animateCommand ? shown : category.command}
                    {animateCommand && !done && caret}
                  </p>
                  {showOptions && (
                    <ul className="flex flex-col gap-2 pt-3">
                      {category.actions.map((action) => {
                        const key = actionKey(action)
                        const inner = (
                          <>
                            <span className="text-gold" aria-hidden="true">
                              {'>'}
                            </span>
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
                                onClick={() => openFaq(action)}
                                className={ROW_CLASS}
                              >
                                {inner}
                              </button>
                            ) : action.type === 'whatsapp' ? (
                              <a
                                href={action.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setOpen(false)}
                                className={ROW_CLASS}
                              >
                                {inner}
                              </a>
                            ) : (
                              <Link
                                href={action.href}
                                onClick={() => setOpen(false)}
                                className={ROW_CLASS}
                              >
                                {inner}
                              </Link>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        {/* Peek bubble — the nudge's spoken half. Decorative. */}
        <AnimatePresence>
          {nudging && (
            <motion.div
              initial={{ opacity: 0, x: 8, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 8, scale: 0.9 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: 'right center' }}
              className="absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-lg border border-sky/20 bg-ink px-3 py-2 font-mono text-xs text-cream shadow-lg"
              aria-hidden="true"
            >
              <span className="text-gold">$ </span>need a hand?
            </motion.div>
          )}
        </AnimatePresence>

        <button
          ref={launcherRef}
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? closeLabel : 'Open the Safar assistant'}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? panelId : undefined}
          className={cn(
            'relative flex h-14 w-14 items-center justify-center rounded-2xl border border-sky/25 bg-ink shadow-lg transition-transform',
            'hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky focus-visible:ring-offset-2',
            nudging && 'assistant-nudge',
          )}
        >
          {firstVisit && !open && !reducedMotion && (
            <span
              className="assistant-pulse pointer-events-none absolute inset-0 rounded-2xl border-2 border-sky/50"
              aria-hidden="true"
            />
          )}
          <WhaleAvatar blink={!open && !reducedMotion} className="h-10 w-10" />
          <span
            className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-sm border border-ink bg-pine"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  )
}

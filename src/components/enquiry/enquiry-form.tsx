'use client'

import { useActionState, useId } from 'react'
import { CheckCircle2 } from 'lucide-react'

import { enquiryAction } from '@/app/actions/enquiry'
import { Button } from '@/components/ui/button'
import { WhatsAppButton } from '@/components/whatsapp-button'
import type { TripContext } from '@/lib/enquiry'

const fieldClass =
  'mt-1 w-full rounded-lg border border-border bg-cream px-4 py-3 text-ink placeholder:text-ink/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea/50'

/**
 * The "Request this trip" form (ADR-0002, issue #8). Prefilled with the trip
 * being viewed (hidden fields, captured on the Lead), it validates via the
 * `enquiryAction` server action, shows field errors and a confirmation state,
 * and offers a one-tap WhatsApp deep-link as an alternative path. No payment.
 */
export function EnquiryForm({
  trip,
  whatsappHref,
}: {
  trip: TripContext
  whatsappHref: string | null
}) {
  const [state, action, pending] = useActionState(enquiryAction, null)
  const formId = useId()

  if (state?.ok) {
    return (
      <div className="rounded-2xl bg-card p-8 text-center shadow-soft">
        <CheckCircle2 className="mx-auto size-10 text-sea" aria-hidden />
        <h3 className="mt-4 font-display text-2xl text-ink">Enquiry sent - thank you!</h3>
        <p className="mx-auto mt-2 max-w-md text-ink/70">
          We&apos;ve got your request for <strong>{trip.title}</strong> and an advisor
          will be in touch soon. Prefer to talk now?
        </p>
        {whatsappHref && (
          <div className="mt-6 flex justify-center">
            <WhatsAppButton href={whatsappHref}>Message us on WhatsApp</WhatsAppButton>
          </div>
        )}
      </div>
    )
  }

  const errors = state && !state.ok ? state.errors : {}

  return (
    <form action={action} className="rounded-2xl bg-card p-6 shadow-soft sm:p-8" noValidate>
      {/* Trip context — captured on the Lead. */}
      <input type="hidden" name="tripType" value={trip.type} />
      <input type="hidden" name="tripTitle" value={trip.title} />
      <input type="hidden" name="tripSlug" value={trip.slug} />
      <input type="hidden" name="tripStartingPrice" value={trip.startingPrice} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id={`${formId}-name`}
          name="name"
          label="Your name"
          required
          error={errors.name}
        />
        <Field
          id={`${formId}-contact`}
          name="contact"
          label="Phone, email, or WhatsApp"
          required
          error={errors.contact}
        />
        <Field
          id={`${formId}-dates`}
          name="preferredDates"
          label="Preferred dates"
          placeholder="e.g. late August"
        />
        <Field
          id={`${formId}-party`}
          name="partySize"
          label="Party size"
          type="number"
          min={1}
          error={errors.partySize}
        />
      </div>

      <div className="mt-5">
        <label htmlFor={`${formId}-message`} className="text-sm font-medium text-ink">
          Anything else?
        </label>
        <textarea
          id={`${formId}-message`}
          name="message"
          rows={4}
          className={fieldClass}
          placeholder="Tell us what you're hoping for."
        />
      </div>

      {errors.trip && (
        <p className="mt-4 text-sm text-destructive" role="alert">
          {errors.trip}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={pending}>
          {pending ? 'Sending…' : 'Request this trip'}
        </Button>
        {whatsappHref && (
          <WhatsAppButton href={whatsappHref} size="default">
            Or ask on WhatsApp
          </WhatsAppButton>
        )}
      </div>
      <p className="mt-3 text-xs text-ink/70">
        No payment - this sends an enquiry an advisor will follow up personally.
      </p>
    </form>
  )
}

function Field({
  id,
  name,
  label,
  error,
  required = false,
  type = 'text',
  placeholder,
  min,
}: {
  id: string
  name: string
  label: string
  error?: string
  required?: boolean
  type?: string
  placeholder?: string
  min?: number
}) {
  const errorId = `${id}-error`
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        min={min}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={fieldClass}
      />
      {error && (
        <p id={errorId} className="mt-1 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

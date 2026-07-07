# Conversion is enquiry-led with lead capture; no online payment

**Decision:** The site converts visitors via Enquiries, not paid bookings. Package pages and the site drive prefilled WhatsApp/call CTAs and a "Request this trip" form that saves a Lead to the CMS and emails staff. There is no checkout, availability, or payment gateway.

**Why:** Safar closes deals by phone/WhatsApp, and online card payments for a Lebanese merchant are genuinely difficult and risky. A full booking+payment flow would be a large, high-risk build for little return at launch. Lead capture gets the business value (every interested visitor captured) without payment complexity.

## Consequences

- No `Booking`/`Order` domain concepts exist — see [CONTEXT.md](../../CONTEXT.md) (`Enquiry`, `Lead`).
- If real online booking is ever wanted, it is a separate future initiative, not a small change.

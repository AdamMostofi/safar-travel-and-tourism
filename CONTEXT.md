# Safar Travel & Tourism

The domain of Safar, a Beirut-based travel agency (20 years, 150+ destinations) that sells curated trips and turns website visitors into enquiries its staff close by phone/WhatsApp. This glossary is the canonical vocabulary for the rebuild; use these terms in code, content, and issues.

## Language

**Package**:
A bookable trip offering — one or more destinations with a duration, a starting price, an information blurb, inclusions, and a photo gallery. The core sellable unit of the site.
_Avoid_: Tour, Deal, Trip, Vacation, Offer.

**Cruise**:
A Package whose transport and lodging is a cruise ship. Sold and browsed as its own top-level category, separate from land Packages.
_Avoid_: Voyage, Sailing.

**Destination**:
A place Safar sells Packages to (a country or city, e.g. Turkey, Maldives). Used to group and browse Packages; a Destination has many Packages.
_Avoid_: Location, Place, Region.

**Starting Price**:
The indicative "from" price of a Package, shown as `Starting $X`. It is a marketing figure to set expectations, never a checkout total — the site takes no payment.
_Avoid_: Price, Cost, Fare, Rate.

**Inclusions**:
The list of what a Package's Starting Price covers (e.g. accommodation, tickets, insurance, airport transfers). Rendered from the "Price Includes" content.
_Avoid_: Features, Perks, Benefits.

**Enquiry**:
A prospective customer's request about a specific Package (or a general question). The primary conversion action on the site — never a paid booking.
_Avoid_: Booking, Order, Reservation, Purchase.

**Lead**:
A captured Enquiry stored for staff follow-up (name, contact, trip of interest, dates, party size). Persisted in the CMS and emailed to staff.
_Avoid_: Contact, Ticket, Submission.

**Featured**:
A flag marking a Package or Destination for prominent placement (e.g. "Popular Tours", "Top Destinations" on the home page). Editorial curation, not a separate entity.
_Avoid_: Highlighted, Promoted, Pinned.

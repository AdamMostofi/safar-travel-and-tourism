# Launch English-only, but model content and layout to be localization-ready

**Decision:** V1 ships in English only. The CMS content model and page layouts are designed so a second language — specifically Arabic, which requires full right-to-left (RTL) layout — can be added later without a rebuild.

**Why:** English matches the current site and Beirut business norms and is the fastest path to launch. Full bilingual EN/AR with RTL is meaningful added scope (every layout, dual typography, translated content) that isn't justified for v1 — but designing it out now would be expensive to retrofit, so we keep the seams.

## Consequences

- Content fields are structured to allow a future locale dimension; avoid hard-coded English strings in components where a localization layer would later live.
- Layout/CSS choices should not assume LTR in ways that block a later RTL flip.

# Heading – Implementation Notes

## Renamed from `Title` (Matt Massey, 2026-08-28)

**Decision:** Renamed the component from `Title` to `Heading` — designers refer to semantic tags
(`h1`-`h6`, `span`, `p`), and "Title" wasn't part of that vocabulary. `Heading` + `Text` are now
Recursica's common typography component names across all adapters. No behavior change.

## `.root` `text-wrap: balance` (Matt Massey, 2026-08-28)

**Decision:** Added `text-wrap: balance` via a new `Heading.module.css` `.root` class, merged onto
the typography class for every `order` (h1–h6), alongside the caller's own `className`.

**Implementation:** UX asked for more evenly balanced multi-line wrapping instead of a ragged last
line — headings are the primary intended use case for this property. Not a design token — it's a
layout algorithm choice, so it's hardcoded rather than pulled from `recursica_variables_scoped.css`.
Chromium/Firefox only balance up to ~6 lines, which comfortably covers heading text. No fallback
needed — browsers that don't support the value just ignore the declaration.

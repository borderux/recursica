# Typography – Implementation Notes

`Typography` is the shared rendering base for both `Text` and `Title` in mui-adapter — anything
applied here reaches both components.

## `.root` `text-wrap: balance` (Matt Massey, 2026-08-28)

**Decision:** Added `text-wrap: balance` via a new `Typography.module.css` `.root` class, merged
onto the typography class alongside the caller's own `className`. Since both `Text` and `Title`
render through this component, it covers all `order` heading levels (h1–h6) and paragraph text in
one place.

**Implementation:** UX asked for more evenly balanced multi-line wrapping instead of a ragged last
line. Not a design token — it's a layout algorithm choice, so it's hardcoded rather than pulled
from `recursica_variables_scoped.css`. Most effective on short text (headings); Chromium/Firefox
only balance up to ~6 lines, so long paragraphs silently fall back to normal wrapping past that
point. No fallback needed — browsers that don't support the value just ignore the declaration.

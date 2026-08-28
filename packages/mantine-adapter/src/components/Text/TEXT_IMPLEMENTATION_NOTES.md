# Text – Implementation Notes

## `.root` `text-wrap: balance` (Matt Massey, 2026-08-28)

**Decision:** Added `text-wrap: balance` via a new `Text.module.css` `.root` class, merged onto the
typography class alongside the caller's own `className`.

**Implementation:** UX asked for more evenly balanced multi-line wrapping instead of a ragged last
line. Not a design token — it's a layout algorithm choice, so it's hardcoded rather than pulled
from `recursica_variables_scoped.css`. Chromium/Firefox only balance up to ~6 lines; longer
paragraphs silently fall back to normal wrapping past that point. No fallback needed — browsers
that don't support the value just ignore the declaration.

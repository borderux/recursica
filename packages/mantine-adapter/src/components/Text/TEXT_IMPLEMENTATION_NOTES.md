# Text – Implementation Notes

## `emphasis` (opacity) + `state` (color) props

**Decision:** Both props are surfaced as `data-*` attributes (`data-emphasis`, `data-state`)
on the underlying element, and `Text.module.css` maps them to tokens via attribute selectors —
matching the `data-*` pattern used by `Label`.

**Token mapping (validated against `recursica_variables_scoped.css`):**

- `emphasis` sets **opacity** only (never color): `high` → `--recursica_brand_text-emphasis_high`
  (`opacities.solid`, 1.0), `low` → `--recursica_brand_text-emphasis_low` (`opacities.smoky`,
  0.94). Because it never touches `color`, it is layer-agnostic.
- `state` sets **color**: `success`/`alert`/`warning` →
  `--recursica_brand_palettes_core-colors_{state}_tone` (theme-neutral aliases that resolve per
  active theme, independent of the current layer).

**Precedence:** `state` wins over `emphasis`. The opacity rules are gated with `:not([data-state])`
so a stateful text always renders at full opacity — combining `state` with `emphasis="low"` is
not a supported combination (the state color must not be dimmed). `emphasis` defaults to `"high"`
(opacity 1.0, a visual no-op) so pre-existing `<Text>` usage is unchanged; `state` has no default
so unset text keeps inheriting the layer color.

## `.root` `text-wrap: balance` (Matt Massey, 2026-08-28)

**Decision:** Added `text-wrap: balance` via a new `Text.module.css` `.root` class, merged onto the
typography class alongside the caller's own `className`.

**Implementation:** UX asked for more evenly balanced multi-line wrapping instead of a ragged last
line. Not a design token — it's a layout algorithm choice, so it's hardcoded rather than pulled
from `recursica_variables_scoped.css`. Chromium/Firefox only balance up to ~6 lines; longer
paragraphs silently fall back to normal wrapping past that point. No fallback needed — browsers
that don't support the value just ignore the declaration.

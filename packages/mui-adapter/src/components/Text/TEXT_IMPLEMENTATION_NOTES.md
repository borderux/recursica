# Text – Implementation Notes

## `emphasis` (opacity) + `state` (color) props

**Decision:** Mirrors the mantine adapter for visual parity. Both props are surfaced as
`data-*` attributes (`data-emphasis`, `data-state`) and mapped to tokens by `Text.module.css`
attribute selectors, referencing the identical CSS variables mantine uses
(`--recursica_brand_text-emphasis_{high,low}` for opacity;
`--recursica_brand_palettes_core-colors_{success,alert,warning}_tone` for color).

**MUI-specific wiring gotcha:** `Text` delegates rendering to the shared `Typography`
component, whose `filterStylingProps` **strips a passed `className`** (it's a blocked styling
key). Only `typographyClass` is appended verbatim. So the module `.root` class — which carries
the emphasis/state attribute selectors — is injected via `typographyClass`
(`` `recursica_brand_typography_${variant} ${styles.root}` ``), not `className`. The `data-*`
attributes are not blocked, so they flow through `...rest` → `filterStylingProps` → the root
DOM element unchanged. `Typography.tsx` itself is intentionally left untouched (it is reused by
`Heading` and others).

**Precedence & defaults:** identical to mantine — `state` wins over `emphasis` (opacity rules are
gated with `:not([data-state])`, so a stateful text renders at full opacity); `emphasis` defaults
to `"high"` (opacity 1.0, a no-op); `state` has no default.

## `StaticVariations` story gap didn't match mantine (2026-08-30, source-of-truth audit)

**Found:** `ui-kit-text--static-variations` used `gap: "24px"` in its own inline story wrapper,
while mantine's equivalent story used `gap: "16px"` — same component, same six variants, but
visibly more vertical space between each item in mui's render. Not a component bug: `Text.tsx`
itself has no opinion on inter-item spacing; the gap is entirely owned by each story's own
`<div style={{ display: "flex", flexDirection: "column", gap }}>` wrapper. Fixed by changing the
story's `gap` to `"16px"` to match mantine's.

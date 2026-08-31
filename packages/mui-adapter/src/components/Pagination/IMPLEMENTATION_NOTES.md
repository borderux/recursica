# Pagination Implementation Notes

- **Compositional API Dropped:** Mantine's original `Pagination` component relies heavily on dot-notation sub-components (`Pagination.Root`, `Pagination.Items`, `Pagination.Control`, etc.). MUI's `<Pagination>` is fundamentally monolithic. Following architectural review, we have decided to drop the dot-notation wrappers for `mui-adapter` and rely strictly on MUI's monolithic API. Storybook and visual regression tests have been updated to reflect this divergence while retaining core property mapping compatibility.

## `renderItem` was never wired up (source-of-truth audit, 2026-08-30)

`Pagination.module.css` already had complete, correctly-tokenized rules for `.control` (the
circle/pill for every page/nav item), `.dots` (the ellipsis), `.iconWithLabel`, and `.baseIcon` —
and `Pagination.icons.tsx` already had `PaginationIcon` plus `NextWithLabel`/`PrevWithLabel`/
`FirstWithLabel`/`LastWithLabel` fully built. None of it was ever applied: `Pagination.tsx` only
mapped MUI `Pagination`'s top-level `classes` prop (`root`/`ul` — the _only_ two slots MUI's own
`Pagination` component exposes) and silently discarded the `withLabels` prop entirely. Every
page/nav button rendered as MUI's own completely unstyled default `PaginationItem` — explaining
the whole cluster of reported issues at once: undersized circles (no `.control` height/width),
grey selected state and missing outline (no `.control`/`[data-active]` colors), wrong font color,
default MUI arrow icons in the wrong color (no `PaginationIcon`), default ripple (MUI's
`PaginationItem` uses `ButtonBase` with ripple enabled by default), and no text labels ever
possible (`withLabels` was read and thrown away).

**Fix:** `Pagination.tsx` now passes a `renderItem` to `MuiPagination` that renders every item as
`<PaginationItem className={styles.control} data-active={item.selected} data-variant={isNavigation
? "text" : undefined} disableRipple slots={...} />` (ellipsis items get `styles.dots` instead).
`slots.first/last/next/previous` point at `PaginationIcon` (plain) or the `*WithLabel` components
(when `withLabels` is true) — both were already correctly built to work as MUI `PaginationItem`
icon slots (only the icon itself receives MUI's forwarded className/props via `{...props}` spread
onto the inner `PaginationIcon`, not the outer label-wrapping `<div>`, so the label text isn't
constrained by MUI's icon-sized styled wrapper).

Also added a local `--pagination-control-size` bridge variable (bound to the Button height token
`.control` is already sized from) — `.baseIcon`'s `calc(var(--pagination-control-size) / 1.8)`
was copied verbatim from mantine-adapter, where `--pagination-control-size` is a _native_ Mantine
CSS variable Mantine's own `Pagination` stamps onto the DOM already; MUI has no equivalent, so
the calc silently resolved to `NaN`/`0` here until this bridge was added.

**Residual, not fixed:** the previous/next chevron control renders ~3.8px wider in mantine
(51.8px vs. mui's exact 48px square) — mantine's own icon-only nav button apparently doesn't
collapse fully to `min-width` the way mui's `PaginationItem` does. Pixel-matched everywhere else
(page-number circle size/color/border, selected state, ellipsis centering, chevron colors, hover
treatment, ripple removal, text labels) — not investigated further given the small, cosmetic
scope of this one remaining gap.

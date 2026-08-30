# Table — Implementation Notes (Internal)

## Background

Table.module.css already had full CSS for header/cell/footer sorted, disabled, currency, and
selected states, keyed off `data-sorted`/`data-disabled`/`data-currency`/`data-selected`
attributes — but nothing in Table.tsx ever set those attributes, so the states were unreachable
and their tokens showed as "unused" in the token analyzer. This pass adds the props that
actually set them; it does not add any new CSS selectors for those states.

## Why not the 4-component split from the Forge reference implementation

Forge's Mantine Table reference (reviewed 2026-08-22) splits `Table`/`TableHeader`/`TableCell`/
`TableFooter` into four separate top-level components, each computing CSS custom properties in
JS and injecting them via inline `style`. We deliberately did not port that:

- It bypasses `filterStylingProps`/`overStyled` and computes styling values in TSX instead of
  referencing tokens directly in the CSS module — both are hard "no" per
  `adapter-common/docs/COMPONENT_DEV_GUIDE.md` (§1 "No custom properties set from TSX for
  styling", §3.1 `overStyled`/`filterStylingProps`).
- It uses a `layer`-scoped token naming convention (`properties_colors_layer-0_...`) that
  doesn't exist in this repo's tokens and isn't the sanctioned way to handle layers here (layer
  is set only by wrapping in `<Layer>`, never a component prop — see the canonical guide's
  "Layers" section).
- Per direction from Matt (2026-08-22): keep the existing dot-notation composition
  (`Table.Th`/`Table.Td`/`Table.Tr`/`Table.Tfoot`/etc., mirroring Mantine's own API) rather than
  introducing new component names — "align with the underlying UI-kit's components, but style
  with Recursica."

Instead, `Table.Th`/`Table.Td`/`Table.Tr` gained real Recursica props (`sorted`, `disabled`,
`variant`, `selected`) that set `data-*` attributes on themselves, activating the CSS that was
already there.

## Footer cells reuse `Table.Td`, not a new component

There's no separate "footer cell" component. A `Table.Td` nested inside `Table.Tfoot` picks up
the footer-specific CSS automatically via the existing `.root tfoot td` structural selector in
Table.module.css — `variant="currency"` and `disabled` work identically whether the `Table.Td`
is in `Table.Tbody` or `Table.Tfoot`.

## Sort icon is rendered by `Table.Th` itself, not composed by the consumer

Mantine's `Table` has no sortable-header primitive (unlike MUI's `TableSortLabel`), so
`Table.Th` renders its own chevron (`Table.icons.tsx`, plain inline SVGs — no icon package
dependency, same convention as `DatePicker.icons.tsx`) when `sorted` is `"asc"`/`"desc"`, sized
via the existing `.sortIcon` CSS rule. Also sets `aria-sort` for accessibility (Mantine doesn't
set this itself). This is intentionally asymmetric with `mui-adapter`, where sorting is composed
via `Table.SortLabel` instead — see that adapter's own implementation notes.

## Selectable rows (checkboxes)

Neither Mantine's `Table` nor `@mui/material`'s `Table` has a built-in checkbox-driven row
selection feature (confirmed 2026-08-22 — MUI's own docs treat it as a compose-it-yourself
recipe with a plain `Checkbox`; the only MUI product with built-in selection is
`@mui/x-data-grid`, not installed here). `Table.Tr`'s `selected` prop only controls the
selected-row background/token state; wiring an actual checkbox column is a separate,
not-yet-scoped ask.

## Currency alignment on header/footer reuses the table-cell token

`--recursica_ui-kit_components_table-cell_properties_currency-style_text-align` (`right`) is the
only currency-style text-align token the UI Kit exports — there's no
`table-header_properties_currency-style_*` block at all, and the
`table-footer_properties_currency-style_*` block skips `text-align` specifically. `Table.module.css`
reuses the table-cell token for both `thead th[data-currency="true"]` and
`tfoot td[data-currency="true"]` so header/footer currency cells stay right-aligned in step with
the body. `Table.Th` gained a `variant` prop (mirroring `Table.Td`) to set `data-currency` since
header cells had no way to opt into this before.

## Deliberately not changed

- **No wrapper divs** — Forge wraps the table in two divs to get a scrollable bordered
  container. The canonical guide forbids wrapper divs; `Table.ScrollContainer` (already wraps
  Mantine's own `Table.ScrollContainer`) is the sanctioned way to get a scrolling table.
- **Hover compositing, striping direction/row parity, row-padding semantics** — Forge diverges
  from our current CSS on these (see the 2026-08-22 review), but none of them are confirmed
  bugs vs. intentional design choices already baked into Figma's tokens. Left as-is; flag to
  design if a change is wanted.

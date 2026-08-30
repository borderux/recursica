# Table — Implementation Notes (Internal)

## Background

Unlike `mantine-adapter`, this package's `Table.module.css` was an empty stub — none of the
header/cell/footer/row tokens were wired at all (the "table-header/table-footer/table-cell, 88
tokens" gap from the 2026-08-21 token-analyzer review). This pass writes that CSS from scratch,
porting the structure/token references already proven out in `mantine-adapter`'s
`Table.module.css`, adapted to MUI's DOM and class model.

## One `Table.Cell`, not separate header/body/footer components

MUI's own `TableCell` is a single primitive for header, body, and footer cells — it auto-detects
which one it is (and whether to render `<th>` or `<td>`) from its ancestor
(`Table.Head`/`Table.Body`/`Table.Footer`). Recursica's `Table.Cell` mirrors that instead of
splitting into per-context components (see the Forge reference-implementation review,
2026-08-22, and direction from Matt the same day: align with the underlying kit's own
components). Its props cover both concerns: `sorted` (header-only in practice) and `variant`
(body/footer). `sorted` has no effect on styling unless the cell also carries the header's
`data-sorted`-driven CSS (i.e. it's meaningless on a body/footer cell) — nothing prevents a
caller from passing it there by mistake; that's an accepted tradeoff of unifying the three
contexts into one component, same tradeoff MUI's own `TableCell` makes.

## Every sub-component now attaches its own CSS module class

Before this change, `Table.Body`/`Table.Cell`/`Table.Container`/`Table.Head`/`Table.Row`/
`Table.Footer`/`Table.SortLabel` attached no Recursica class at all — only the root `Table` did.
`Table.Cell` and `Table.Row` now attach `.cell`/`.row` (needed so the CSS in `Table.module.css`
can select on state, e.g. `.cell[data-disabled="true"]`, instead of bare `td`/`tr` tag
selectors). `Table.SortLabel` attaches `.sortLabel` (see below). `Body`/`Container`/`Head`/
`Footer` were left alone — the CSS only needs to reach them structurally (`thead`/`tbody`/
`tfoot`), so they don't need a class of their own for this to work.

## Sort icon comes from `Table.SortLabel`, not `Table.Cell`

MUI already has a sortable-header primitive — `TableSortLabel` — that renders its own
arrow icon and flips it based on `direction`/`active`. `Table.Cell` only sets the sorted-state
_styling_ (`data-sorted` → background/text/font tokens, matching `mantine-adapter`'s `Table.Th`);
the icon itself is `Table.SortLabel`'s job, composed by the consumer the same way MUI's own docs
demonstrate (`<Table.Cell sorted><Table.SortLabel active direction="asc">Name</Table.SortLabel></Table.Cell>`).
`Table.module.css` re-colors the icon to `inherit` (overriding MUI's default sort-label color)
and sizes/spaces it with the same `table-header` icon-size/label-sort-gap tokens
`mantine-adapter` uses for its own inline chevron — see that adapter's `Table.icons.tsx` for the
Mantine-side equivalent. This is intentionally asymmetric between the two adapters: Mantine has
no equivalent primitive, so its `Table.Th` renders the chevron itself.

## MUI's own `.Mui-selected` background is reset

`Table.Row`'s `selected` prop passes straight through to MUI's native `TableRow.selected` (kept
for the `aria-selected`/`Mui-selected` semantics it drives) _and_ sets `data-selected`. Found via
screenshot comparison against `mantine-adapter` (2026-08-22): MUI's own default `.Mui-selected`
row background was compositing underneath our token-driven `.cell` background (semi-transparent
`color-mix` over MUI's own tint instead of over nothing), producing a visibly different color
than Mantine's. `Table.module.css` resets `.row:global(.Mui-selected)` to
`background-color: transparent` so only the Recursica token color shows — same
override-the-library's-own-styling rule the canonical guide documents for hover.

## Currency alignment on header/footer reuses the table-cell token

`--recursica_ui-kit_components_table-cell_properties_currency-style_text-align` (`right`) is the
only currency-style text-align token the UI Kit exports — there's no
`table-header_properties_currency-style_*` block at all, and the
`table-footer_properties_currency-style_*` block skips `text-align` specifically.
`Table.module.css` reuses the table-cell token for both `thead .cell[data-currency="true"]` and
`tfoot .cell[data-currency="true"]` so header/footer currency cells stay right-aligned in step
with the body. `Table.Cell` already threads `variant`/`data-currency` through regardless of
context, so no `Table.tsx` change was needed here (unlike `mantine-adapter`'s `Table.Th`).

## Selectable rows (checkboxes)

See `mantine-adapter`'s `TABLE_IMPLEMENTATION_NOTES.md` — confirmed 2026-08-22 that neither
Mantine's nor MUI's base `Table` has a built-in checkbox-selection feature (MUI's only comes via
`@mui/x-data-grid`, not installed here). `Table.Row`'s `selected` prop maps directly onto MUI's
own native `TableRow.selected` (which already sets `aria-selected`/`Mui-selected`) plus a
`data-selected` attribute so our CSS selectors stay identical in shape to `mantine-adapter`'s.

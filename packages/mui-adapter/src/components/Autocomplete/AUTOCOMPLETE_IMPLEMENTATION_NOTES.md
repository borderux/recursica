# Autocomplete Implementation Notes

## Rich Option Content (`leadingIcon`/`supportingText`)

`data` items accept optional `leadingIcon`/`supportingText` fields, via the shared `RecursicaComboboxItem` type in `@recursica/adapter-common` (see `MANTINE_ADAPTER_RICH_OPTION_DATA.md` at the repo root — proposed against the mantine-adapter, but Forge needs both adapters to accept the same `data` shape, hence the type living in adapter-common rather than being redeclared per adapter). `Autocomplete.tsx` runs `data` through adapter-common's `normalizeComboboxData` first (backfills `label` from `value`, since `label` on the shared type is optional), then installs a default `renderOption` that renders each option's `<li>` via `renderRichOptionContent` (`../../utils/renderRichOption.tsx`, shared with `Dropdown`) — `leadingIcon`+`label`+`supportingText` when either new field is present, or just `label` otherwise. A caller-supplied `renderOption` always wins over the default. The icon is only rendered as a child when `leadingIcon` is set (not a hidden reserved slot), so label/supportingText shift left when there's no icon; the row's `align-items: center` keeps the label vertically centered when there's no `supportingText`.

Unlike Dropdown, this doesn't need an explicit `renderValue`-equivalent fix: MUI's `Autocomplete` already separates the closed field's text (driven by `getOptionLabel`, which defaults to `option.label`) from the open dropdown's row rendering (`renderOption`), so enriching `renderOption` alone doesn't touch what the closed field shows.

New CSS classes (`.optionContent`/`.optionIcon`/`.optionText`/`.optionSupportingText`) in `Autocomplete.module.css` reuse the menu-item component's icon/supporting-text tokens, matching the mantine-adapter's equivalent addition — no dedicated autocomplete-option tokens exist for either.

## `wrapItemText`

`label`/`supportingText` default to single-line truncation with an ellipsis (`.optionText > *` — `overflow: clip; overflow-clip-margin: 0.35em; text-overflow: ellipsis; white-space: nowrap`). Passing `wrapItemText` adds `.optionTextWrap` alongside `.optionText`, re-enabling wrapping (`white-space: normal; overflow-wrap: anywhere`) for both children — later-cascade-wins, equal specificity. `renderRichOptionContent` takes `wrapItemText` as a third parameter and combines the two class names when it's true.

`.optionText > *` used plain `overflow: hidden` until 2026-08-28 (Matt Massey) — it clipped
descenders (e.g. "g") whenever `text_line-height` is tighter than the font's natural
ascent+descent. `overflow-clip-margin` gives ink a small bleed allowance while still clipping
genuinely overflowing text; same project-wide fix as Chip's `CHIP_IMPLEMENTATION_NOTES.md`.

## Selected Option Highlight (bug fix)

There was previously no rule at all for "this option matches the current value" — only the shared neutral hover tint, and only while actually hovered. MUI's `Autocomplete` already stamps `aria-selected="true"` onto the matching option (`useAutocomplete.js`'s `getOptionProps`), and `defaultRenderOption` spreads `liProps` (which includes it) straight onto the `<li>`, so the DOM signal was already there — `.option[aria-selected="true"]` now maps it to the same menu-item selected-state background/text-color tokens Dropdown uses. Needs `!important`: MUI's own `.MuiAutocomplete-listbox .MuiAutocomplete-option[aria-selected="true"]` rule (`Autocomplete.js`) is a two-class descendant selector — higher specificity than this single-class rule — and paints its own default blue tint otherwise, same reasoning as the padding `!important` above. Verified via Playwright: `aria-selected="true"` plus the token background color both land on the correct option after a plain click-select-reopen.

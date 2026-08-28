# Dropdown Implementation Notes

## Rich Option Content (`leadingIcon`/`supportingText`)

`data` items accept optional `leadingIcon`/`supportingText` fields, via the shared `RecursicaComboboxItem` type in `@recursica/adapter-common` (see `MANTINE_ADAPTER_RICH_OPTION_DATA.md` at the repo root — proposed against the mantine-adapter, but Forge needs both adapters to accept the same `data` shape, hence the type living in adapter-common rather than being redeclared per adapter). `Dropdown.tsx` and `BareDropdown.tsx` both build `MenuItem` children directly from `data` (there's no Mantine-style `renderOption` indirection here), so rendering the new fields is a straight change to that existing per-item mapping — `renderRichOptionContent` (`../../utils/renderRichOption.tsx`, shared with `Autocomplete`) renders `leadingIcon`+`label`+`supportingText` when either new field is present, or just `label` otherwise. The icon is only rendered as a child when `leadingIcon` is set (not a hidden reserved slot), so label/supportingText shift left when there's no icon; the row's `align-items: center` keeps the label vertically centered when there's no `supportingText` to stack under it.

`label` on the shared type is optional (falls back to `value`) — both components run `data` through adapter-common's `normalizeComboboxData` first (`const normalizedData = normalizeComboboxData(data)`), so every downstream read of `item.label` is a real string, with no per-call-site `?? value` fallback needed.

MUI's closed-field display has no separate slot analogous to Mantine's `option.label` — without a `renderValue`, MUI shows whichever `MenuItem`'s children matched the selected value, which would leak the rich icon/supporting-text row into the closed field. Both components now pass a `renderValue` that looks the selected item back up by value and returns its plain `label`, keeping the closed field a single line of text regardless of what the open dropdown renders.

New CSS classes (`.optionContent`/`.optionIcon`/`.optionText`/`.optionSupportingText`) in `Dropdown.module.css` reuse the menu-item component's icon/supporting-text tokens, matching the mantine-adapter's equivalent addition — no dedicated dropdown-option tokens exist for either.

## `wrapItemText`

`label`/`supportingText` default to single-line truncation with an ellipsis (`.optionText > *` — `overflow: clip; overflow-clip-margin: 0.35em; text-overflow: ellipsis; white-space: nowrap`). Passing `wrapItemText` adds `.optionTextWrap` alongside `.optionText`, re-enabling wrapping (`white-space: normal; overflow-wrap: anywhere`) for both children — later-cascade-wins, equal specificity. `renderRichOptionContent` takes `wrapItemText` as a third parameter and combines the two class names when it's true. `Dropdown.tsx` exposes this as a public prop; `BareDropdown.tsx` (internal-only, not part of the public `Dropdown`/`AutoComplete` API this was requested for) doesn't take the prop and always truncates.

`.optionText > *` used plain `overflow: hidden` until 2026-08-28 (Matt Massey) — it clipped
descenders (e.g. "g") whenever `text_line-height` is tighter than the font's natural
ascent+descent. `overflow-clip-margin` gives ink a small bleed allowance while still clipping
genuinely overflowing text; same project-wide fix as Chip's `CHIP_IMPLEMENTATION_NOTES.md`.

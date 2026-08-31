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

## Missing placeholder (bug fix, Matt Massey, 2026-08-30)

`placeholder` (a real prop on `RecursicaDropdownProps` via `adapter-common`) was accepted but
silently did nothing — it fell through to `...rest`/`sanitizedProps` and got spread onto
`<MuiSelect>`, which only forwards it to its own hidden accessibility `<input>` (invisible to the
user); MUI's `Select` is not a native text `<input>`, so it has no `::placeholder` rendering path
of its own. mantine-adapter's `Select` supports `placeholder` natively, so the equivalent bug never
existed there. Fixed by destructuring `placeholder` explicitly and rendering it from `renderValue`
when the field is empty, wrapped in a new `.placeholder` class (same opacity treatment as
`.input::placeholder`) since a `<span>` inside a non-input element has no pseudo-element to target.

The `ui-kit-dropdown--with-rich-options`/`-wrapped` stories were also flagged as "text isn't
vertically centered" — with no placeholder rendering, MUI's empty `.MuiSelect-select` fell back to
its own zero-width-space filler content (`&#8203;`, used internally to preserve the box's height),
which doesn't establish the same line box a real placeholder string does. Rendering the actual
placeholder text resolved this too — verified via screenshot, no separate CSS change needed.

## Missing input-to-menu gap (Matt Massey, ROUND 2 2026-08-31)

Same gap AutoComplete had: MUI's Select renders its open menu flush against the input, no offset
token exists in the schema for it either. Fixed with the identical technique — `margin-top: var(
--recursica_brand_dimensions_general_default)` on `.dropdown` (the `MenuProps.classes.paper`
target). Unlike AutoComplete's Popper, Select's menu is a Popover, which positions via computed
`top`/`left` rather than an inline `margin: 0`, so no `!important` was needed here.

# FileUpload Implementation Notes

## Architecture Overview

`FileUpload` is a fully custom composite — unlike most other adapter components, there is no
single underlying MUI primitive to wrap (MUI has no drag-and-drop dropzone component at all, in
core or as a separate package). The component composes:

1. **The dropzone** — a plain `<div>` handling native HTML5 drag-and-drop events
   (`onDragOver`/`onDrop`), containing an upload icon, instructional text, and a hidden
   `<input type="file">` triggered by...
2. **The browse button** — this adapter's own `<Button variant="outline" size="small">`.
3. **The file list** — this adapter's own `<Chip>` component (with `onRemove`), one per entry in
   the controlled `files` prop.

This shape is **not configurable** — there is no prop to render a bare native file input without
the dropzone chrome (that's what the separate, still-stub `FileInput` component is for). This
mirrors `mantine-adapter`'s `FileUpload` exactly — implementing the interaction logic with native
DOM APIs on both sides (rather than reaching for a Mantine-only package like `@mantine/dropzone`,
which doesn't have an MUI equivalent anyway) keeps the two adapters at real behavioral parity.

## Pre-existing `Chip` type gap fixed here

MUI's own `ChipProps.children` is typed as `null | undefined` — MUI's `Chip` expects a `label`
prop instead of `children`. This adapter's `Chip.tsx`, however, has always treated `children` as
its real public API (it renders `children` inside its own `label={...}` JSX, which unconditionally
overrides any caller-supplied `label` — so `label` was never actually usable externally to begin
with), but its `ChipProps` type never overrode MUI's restrictive `children` type to reflect that.
This went unnoticed until `FileUpload` needed to pass a file name as `<Chip>{name}</Chip>` and hit
a real compile error. Fixed by omitting `children` from the inherited `MuiChipProps` and re-adding
it as `React.ReactNode` in `Chip.tsx`'s own `ChipProps` — a type-only fix, no runtime behavior
change (the runtime already accepted arbitrary `children`). (Matt Massey, 2026-08-11.)

## Why `Chip` for the file list, not a bespoke tag element

`recursica_variables_scoped.css`'s `file-upload` token namespace defines `item-gap`/`list-spacing`
(spacing between/around file entries) but **no color/border tokens of its own for the file
entries themselves** — the visual design intentionally delegates that to the existing `Chip`
component's own token namespace (`--recursica_ui-kit_components_chip_...`). Reusing `<Chip
onRemove={...}>` directly (rather than reimplementing a similar-looking element) keeps that
separation intact per the canonical guide's "Component Specificity" rule — `FileUpload.module.css`
never reaches into `chip`'s namespace, and `Chip.module.css` never reaches into `file-upload`'s.

Unlike the Mantine adapter's `Chip` (a checkbox/radio-style Mantine `Chip` under the hood, where a
`checked={false}` prop has to be passed to prevent the label text from toggling a selected state),
MUI's `Chip` has no such native toggle semantics — no `checked` prop is passed here at all.

## `border-style` and the malformed Figma token

`--recursica_ui-kit_components_file-upload_properties_border-style` exists in
`recursica_variables_scoped.css`, but its value is the **literal string** `"dashed"` (quotes
included) — not a valid CSS `<line-style>` keyword. Using it via `var(...)` would silently resolve
to an invalid declaration (the browser drops it, and the border falls back to `initial`/`none`,
with no error surfaced anywhere). This is consistent with how `border-style` is already treated
everywhere else in this adapter (e.g. `TextArea` hardcodes its own baseline border styling) — the
canonical guide explicitly lists `border-style` as a baseline/hardcoded structural value, not a
tokenized one. Hardcoded to the keyword `dashed` directly; the malformed token is
`recursica-ignore`d with a note in `FileUpload.module.css`. Worth flagging to design/Forge if the
token is meant to be consumable as-is in a future export.

## No dedicated icon-size token

Unlike `TextField`/`DatePicker`, `file-upload` has no `properties_icon-size` token. The upload
icon is sized with a hardcoded `2rem` to visually match the Figma reference image
(`packages/adapter-common/src/components/FileUpload/fileupload.png`); revisit if a dedicated token
is ever added.

## No distinct "dragging over" visual state

There's no `recursica_variables_scoped.css` token for a drag-hover appearance (only `default`,
`disabled`, and `error` are defined for `file-upload`). Rather than inventing a color/border value
for it, the dropzone has no visual change while a file is being dragged over it — only the
native browser drag cursor. Revisit if a token is added.

## No `!important` needed

Unlike form controls that override MUI's own native input styling (e.g. `TextArea.module.css`
needs `!important` to beat MUI's own `.Mui-error`/`.Mui-disabled` state classes), `FileUpload`'s
dropzone and file list are plain custom `<div>`s with no MUI component involved beyond the
separately-styled `Button`/`Chip` — there's no competing MUI baseline to beat, so the error/
disabled state cascade here uses plain selectors with no `!important`.

## No read-only mode

Every other form-control-shaped component in this adapter (`TextArea`, `NumberInput`, ...)
supports `readOnly` via `WithReadOnlyWrapper`, rendering the value as static text. `FileUpload`
uses `FormControlWrapper` directly instead, with no `readOnly` prop — the Figma reference
(`fileupload.png`) only depicts the interactive dropzone and an empty state, no distinct
read-only rendering, and "read-only" is a less obvious concept for a file list than for a single
text/date/time value. Revisit if a read-only rendering is specified.

## Not a nested interactive element

The dropzone `<div>` itself has no `onClick`/`role="button"`/`tabIndex` — only the explicit
"Browse files" `<Button>` opens the native file picker. Many dropzone implementations make the
entire box clickable in addition to drag-and-drop, but the Figma reference shows the button as
the sole explicit affordance, and avoiding a second, redundant click target inside (or wrapping)
a real `<button>` avoids any nested-interactive-element accessibility ambiguity.

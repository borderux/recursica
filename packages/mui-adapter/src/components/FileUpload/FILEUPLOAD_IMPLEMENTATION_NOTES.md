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

## Dragging-over visual state (Matt Massey, 2026-08-17)

Previously flagged as a known gap ("no distinct dragging-over visual state" — there's still no
`file-upload`-specific token for it), now implemented using two existing generic tokens instead of
inventing new component-scoped ones:

- **Background**: the same "Global Hover Hack Overlay" recipe `Button.module.css` already uses —
  a `::after` pseudo-element sized to `inset: 0`, `background-color:
var(--recursica_brand_states_hover_color)`, faded in to `var(--recursica_brand_states_hover_opacity)`
  via `[data-dragging="true"]` instead of `:hover`. Requires `.dropzone` to be `position: relative`
  and its real children `position: relative; z-index: 1` so they render above the overlay.
- **Border**: `--form-field-border-selected`, the bridge custom property `FormControlWrapper`
  already sets from `--recursica_ui-kit_globals_form_field_colors_border-selected` on its own
  `.root` (an ancestor of `.dropzone` here) — defined for exactly this kind of cross-component
  reuse, but unused anywhere until now. Chosen over reaching for the global token directly, since
  the existing bridge-var pattern is how other component CSS in this adapter already consumes
  globals it doesn't own (see `FormControlWrapper.module.css`).

Tracked via a `dragCounterRef` in `FileUpload.tsx`, not a plain boolean: `dragenter`/`dragleave`
fire for every child element the pointer crosses, not just the dropzone itself, so a plain
enter-sets-true/leave-sets-false toggle flickers off every time the pointer passes over the icon,
label, or button inside the dropzone. Counting nested enter/leave pairs and only clearing the
state at net-zero avoids that.

## No `!important` needed

Unlike form controls that override MUI's own native input styling (e.g. `TextArea.module.css`
needs `!important` to beat MUI's own `.Mui-error`/`.Mui-disabled` state classes), `FileUpload`'s
dropzone and file list are plain custom `<div>`s with no MUI component involved beyond the
separately-styled `Button`/`Chip` — there's no competing MUI baseline to beat, so the error/
disabled state cascade here uses plain selectors with no `!important`.

## Read-only mode (Matt Massey, 2026-08-18)

Previously flagged as a known gap ("no read-only mode" — see below). Unlike `TextArea`/
`NumberInput`, there's no single "value" to swap for static text via `WithReadOnlyWrapper` — a file
list's read-only form is the same chip list, just without the ability to remove anything. So
`readOnly` is handled directly in `FileUpload.tsx` rather than reusing `WithReadOnlyWrapper`:

- The dropzone (icon, instructional text, Browse button, hidden `<input>`) is omitted entirely.
- Each `Chip` is rendered with no `onRemove` (and no `removeTabIndex`/`removeIconRef`/roving
  keyboard handlers, which only exist to manage the remove icon) — `Chip` itself already renders no
  `deleteIcon` at all when `onRemove` is `undefined`, so this falls out for free rather than needing
  a separate `readOnly` prop on `Chip`. (It also means MUI's own `ButtonBase`-on-`onDelete` quirk —
  see the keyboard-navigation section below — never triggers in read-only mode either.)
- `disabled` is independent of `readOnly` and has no effect when `readOnly` is set (there's no
  dropzone/remove icon left for it to disable).

Original gap this replaces: Figma's `fileupload.png` reference only depicted the interactive
dropzone and an empty state, no distinct read-only rendering — revisited once one was specified.

## Assistive text/error delegated back to FormControlWrapper (Matt Massey, 2026-08-18)

Briefly changed to have `FileUpload` render its own `AssistiveElement` directly (dropzone →
assistive/error → file list, all inside the one `children` slot `FormControlWrapper` sees) so the
file list could sit _below_ the assistive text instead of `FormControlWrapper`'s default of
rendering assistive/error _after_ whatever `children` it's given. Reverted at Matt's request:
`assistiveText`/`error` are passed straight through to `FormControlWrapper` again (file list
renders above the assistive/error text, same as every other form control), and `FileUpload` no
longer manages its own `aria-describedby`/`aria-errormessage` wiring — `FormControlWrapper`'s own
`cloneElement` handles that automatically since `FileUpload`'s root `<div>` is a single element.

## Built-in error for `accept` mismatches (Matt Massey, 2026-08-18)

A file rejected for not matching `accept` (see below) now surfaces as the control's own error
state by default, rather than leaving the integrator to wire up `onFilesRejected` into their own
`error` prop just to get a message on screen. `handleFiles` tracks whether the _most recent_
drop/pick attempt included an `accept` mismatch (`invalidTypeRejected` state) and `FileUpload`
computes `effectiveError = error ?? (invalidTypeRejected ? invalidFileTypeMessage : undefined)` —
an explicit `error` prop always wins over the built-in one. The message itself is a new
`invalidFileTypeMessage` prop (`RecursicaFileUploadProps`, adapter-common), defaulting to
`"File type not accepted"`. Scoped to `accept` mismatches only — a `maxSize` rejection still has no
built-in message, since `onFilesRejected` is the only signal for that case and there's no single
reasonable default (unlike the type-mismatch text, "too large" needs the actual limit in it).

## `accept` is now enforced on drop, not just the picker dialog (Matt Massey, 2026-08-18)

The native `accept` attribute on the hidden `<input type="file">` only constrains the browser's own
file-picker dialog — it has **no effect on a `drop` event**, so a file dragged directly onto the
dropzone previously bypassed `accept` entirely regardless of extension/MIME type (the prior doc
comment on `RecursicaFileUploadProps.accept` claimed otherwise; that was wrong and has been
corrected). `handleFiles` (shared by both the picker and drop paths) now also validates every file
against `accept` via a new shared `fileMatchesAccept(file, accept)` util in `adapter-common`
(mirrors the native attribute's own comma-separated extension/MIME/MIME-wildcard semantics) and
routes non-matching files to `onFilesRejected`, the same callback already used for `maxSize`
rejections.

## Not a nested interactive element

The dropzone `<div>` itself has no `onClick`/`role="button"`/`tabIndex` — only the explicit
"Browse files" `<Button>` opens the native file picker. Many dropzone implementations make the
entire box clickable in addition to drag-and-drop, but the Figma reference shows the button as
the sole explicit affordance, and avoiding a second, redundant click target inside (or wrapping)
a real `<button>` avoids any nested-interactive-element accessibility ambiguity. (This is
independent of the file list's own keyboard navigation below, which lives entirely in the
separate `Chip` list, not the dropzone.)

## Custom upload icon (Matt Massey, 2026-08-17)

Added `icon?: React.ReactNode` to `RecursicaFileUploadProps` (adapter-common) — `FileUpload`
renders `icon ?? <UploadIcon />` inside the same `.uploadIcon` span either way, so a custom icon
picks up the same `color`/`width`/`height` styling the default one gets (use `currentColor` and
fill the viewbox, like `UploadIcon` does, for it to inherit correctly).

## Browse button size (Matt Massey, 2026-08-17)

The "Browse files" `<Button>` was hardcoded to `size="small"`. There's no design rationale for a
smaller-than-normal button here — the Figma reference simply wasn't checked against `Button`'s own
size tokens closely enough when this was first built. Removed the `size` prop entirely so it falls
through to `Button`'s own default (`"default"`, the standard size used everywhere else in both
adapters).

## Keyboard navigation for the file chip list (Matt Massey, 2026-08-17)

The file list previously had no group-level keyboard model at all — each chip's remove icon was
simply the next `tabIndex={0}` element in natural DOM order. Implemented a standard roving-tabindex
pattern instead, matching `Tree`'s existing keyboard model (see `../Tree/IMPLEMENTATION_NOTES.md`)
rather than inventing a new one:

- **Tab reaches exactly one stop per chip list, landing on the first chip.** `FileUpload` tracks
  `activeChipIndex` (initially `0`) and passes `removeTabIndex={index === activeChipIndex ? 0 : -1}`
  to each `Chip` — a new pass-through prop added to `RecursicaChipProps`/both adapters' `Chip.tsx`
  (see `../Chip/CHIP_IMPLEMENTATION_NOTES.md`) that overrides the remove icon's own tabIndex.
  Every `<Chip>` here is also given a plain `tabIndex={-1}` directly (flows through to `MuiChip`
  via the existing `sanitizedProps` passthrough) — MUI's `Chip` silently renders its root as a
  focusable `ButtonBase` (not a plain `<div>`) whenever `onDelete` is set, _even with no `onClick`_
  (see `component = clickable || onDelete ? ButtonBase : ...` in MUI's own `Chip.js`), so without
  this override the root would be a second, unwanted tab stop ahead of the remove icon on every
  chip — the same class of bug as the Mantine adapter's checkbox `<input>`, just from a different
  MUI internal.
- **Enter removes the focused chip, with focus already on its remove icon.** No new code needed —
  `Chip`'s `onDelete`/`deleteIcon` wiring already responds to activation on the focused delete
  icon, which is already the focused element by construction (see above), so "focus ring on the
  remove icon" falls out for free from the existing `.removeIconWrapper:focus-visible` style.
- **Left/Right or Up/Down move focus between chips.** A `onKeyDown` handler on the file list `<div>`
  (event delegation — it fires for keydowns on any focused chip inside it) computes the next index
  (wrapping at both ends) and moves real DOM focus there via `removeIconRefs`, an array of refs
  populated through the new `removeIconRef` prop on `Chip` (same PR as `removeTabIndex`) — set
  directly on the `<span>` passed as `deleteIcon`, which MUI's `Chip` preserves when it clones that
  element.
- **Focus survives removal.** Since `files` is a controlled prop `FileUpload` doesn't mutate
  itself, removing a chip doesn't shrink `files` until the consumer's own state update flows back
  down as a new prop — a `useEffect` keyed on `files` detects the length decreasing, clamps
  `activeChipIndex` to the new last-valid index, and re-focuses that chip's remove icon, so focus
  never falls out of the list back to `<body>`.

## Maximum file count (Matt Massey, 2026-08-18)

Added `maxFiles`/`maxFilesMessage` to `RecursicaFileUploadProps` (adapter-common), enforced the
same way `maxSize`/`accept` already are: `handleFiles` compares `files.length` (the current count)
plus how many of the incoming batch have already been provisionally accepted against `maxFiles`,
and routes anything past the cap to `onFilesRejected` instead of `onFilesAdded`. The built-in
`maxFilesMessage` ("Maximum of {maxFiles} files allowed") surfaces through the same
`effectiveError` mechanism `invalidFileTypeMessage` already uses — an explicit `error` prop still
wins over both, and an `accept` mismatch takes priority over a `maxFiles` one when a single drop
triggers both.

## Read-only chips were still interactive (Matt Massey, 2026-08-18)

The `readOnly` file list (added 2026-08-18, see USAGE.md §7) rendered each filename as a
`<Chip tabIndex={-1}>` with no `onRemove`, expecting that to be fully inert. It wasn't, because of
a bug shared with the Mantine adapter that lives entirely in `Chip`/`Chip.module.css`, not
`FileUpload` — see the Mantine adapter's `FILEUPLOAD_IMPLEMENTATION_NOTES.md` for the parallel
write-up. The MUI-specific pieces:

- **The chip's cursor still showed `pointer` on hover with no real interaction wired.** `.root.root`
  hardcoded `cursor: pointer` unconditionally — unlike Mantine, this wasn't inherited from MUI's own
  base styles, just a pre-existing hardcode here that never accounted for a non-interactive chip.
  Added an `isInteractive` check to `Chip.tsx` (`onRemove`/`onClick`/`onChange` — MUI's `Chip` has
  no `checked`-driven native-input case to misread, unlike Mantine's) and a `data-interactive`
  attribute that gates `cursor: pointer` in CSS; a chip with none of those handlers now falls back
  to whatever MUI's own un-clickable `Chip` renders as (no cursor override, no `ButtonBase`).
- **The truncating filename text was itself a phantom, un-styled Tab stop.** Same root cause as the
  Mantine adapter: `.children` truncates via `overflow-x: hidden`, which Chromium treats as a
  focusable scroll container whenever its content actually overflows — regardless of any
  `tabindex`. Switched to `overflow-x: clip` (same visual result, no scrollport, so it's never a
  focus candidate).

Confirmed via Playwright against a running Storybook: before the fix, `Tab` from the "Browse files"
button in `WithFiles` landed on the first chip's filename text, THEN its remove icon — an extra,
invisible tab stop before the intended one. After the fix, `Tab` goes directly to the remove icon,
and in `ReadOnly`, `Tab` skips the file list entirely (there's nothing in it to focus).

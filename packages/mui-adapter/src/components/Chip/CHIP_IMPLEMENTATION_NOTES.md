# Chip Implementation Notes

## Architecture decisions

### MUI DOM Structure & Label/Icon Overrides

MUI's `<Chip>` renders a plain `<div>` root with an optional leading `icon`, a `label`, and an
optional `deleteIcon` — no hidden `<input>` involved (unlike Mantine's checkbox/radio-based
`Chip`). This adapter targets MUI's own style hooks (`classes.root`/`classes.label`/`classes.icon`/
`classes.deleteIcon`) directly via the `classes` prop, matching the same visual surface the
mantine-adapter's `Chip` exposes.

### Icon and Remove Implementations

To match the mantine-adapter's internal `children` wrapper strategy, `label` is always set to a
`<span className={styles.innerWrapper}><span className={styles.children}>{children}</span></span>`
— any caller-supplied `label` in `sanitizedProps` is unconditionally overridden, since this
component's real public API is `children`, not `label` (see the `Chip.tsx` type comment: MUI's own
`ChipProps.children` is typed `null | undefined`, re-typed here as `React.ReactNode`).

`deleteIcon` and `icon` are each wrapped in their own `<span>` (`styles.removeIconWrapper`/
`styles.leadingIcon`) rather than styled as bare SVGs, so sizing/color/gap tokens have a stable
element to target — MUI clones whatever element is passed as `deleteIcon`/`icon`, adding only its
own `className`/`onClick`, so a `ref`/`tabIndex` set directly on that `<span>` survives the clone
untouched.

### Long-label truncation was hiding the remove icon (Matt Massey, 2026-08-17)

Same root cause as mantine-adapter's `Chip` (see its `CHIP_IMPLEMENTATION_NOTES.md`): `.children`
had ellipsis/`overflow: hidden`/`white-space: nowrap` but no `min-width: 0` on it or `.innerWrapper`,
so a flex child never actually shrank enough to trigger the ellipsis — the label overflowed instead,
pushing `.removeIconWrapper` outside the chip's clipped `max-width`. Fixed by adding `min-width: 0`
to `.innerWrapper`/`.children` and `flex-shrink: 0` to `.leadingIcon`/`.removeIconWrapper`.

### The remove icon had no accessible label and no real keyboard activation (Matt Massey, 2026-08-17)

`removeLabel` was destructured from props and defaulted to `"Remove"`, but was never actually
applied anywhere — dead code (`// eslint-disable-next-line @typescript-eslint/no-unused-vars`)
since this component was first built. The `deleteIcon` `<span>` had no `aria-label`, no `role`, and
no keyboard handler of its own: MUI's own `onDelete` wiring only reacts to `Backspace`/`Delete`,
and only when the _root_ itself is both the event's `target` and `currentTarget` (see
`isDeleteKeyboardEvent`/`handleKeyUp` in MUI's own `Chip.js`) — it never fires once focus moves onto
a child span directly (which is exactly what happens once you `.focus()` the remove icon
imperatively, as `FileUpload`'s roving-tabindex group does below). A plain `<span>` also gets no
native Enter/Space-triggers-click behavior the way a real `<button>` would. Fixed by adding
`role="button"`, `aria-label={removeLabel}`, and an explicit `onKeyDown` for `Enter`/`Space` that
calls `onDelete` directly — matching the mantine-adapter `Chip`'s remove icon, which already did all
three.

### Roving tabindex support for chip groups (Matt Massey, 2026-08-17)

Added two optional pass-through props — `removeTabIndex` and `removeIconRef` — purely so a parent
managing a _group_ of chips (e.g. `FileUpload`'s file list, see its own `IMPLEMENTATION_NOTES.md`)
can implement roving-tabindex/arrow-key navigation across them: set `removeTabIndex={-1}` on every
chip but the currently-active one, and use `removeIconRef` to move real DOM focus there
imperatively on arrow-key press. Both are set directly on the `<span>` passed as `deleteIcon`,
which MUI's `Chip` preserves when it clones that element. Both are no-ops for a standalone `Chip`
(defaults: `tabIndex={0}`, no ref) — this doesn't change any existing single-chip behavior.

A group composing multiple chips also needs to pass a plain `tabIndex={-1}` directly on each
`<Chip>` itself (not just `removeTabIndex` on the remove icon) — MUI's `Chip` silently renders its
_root_ as a focusable `ButtonBase` (not a plain `<div>`) whenever `onDelete` is set, even with no
`onClick` (`component = clickable || onDelete ? ButtonBase : ...`), so without this the root is a
second, unwanted tab stop ahead of the remove icon on every chip. `FileUpload` does this; any other
consumer building a roving-tabindex chip group needs to as well.

### Descenders were being clipped on `.children` and `.root` (Matt Massey, 2026-08-18)

Same root cause and fix as mantine-adapter's `Chip` (see its `CHIP_IMPLEMENTATION_NOTES.md`): a
label with a descender (e.g. the "g" in "image.png") had its bottom clipped off, because both
`.children` and `.root.root` set plain `overflow: hidden` — needed on the x-axis for
`text-overflow: ellipsis`/`max-width` truncation, but clipping the y-axis too cuts off glyph ink
that extends past a `text_line-height` token tighter than the font's natural ascent+descent. Split
both into `overflow-x: hidden; overflow-y: visible;`; truncation is unaffected (still x-axis only).
Unlike mantine's `Chip`, MUI's `.root.root` _is_ the visible pill (background-color/border-radius
live there, not on a separate `.label`), but border-radius rendering doesn't depend on `overflow`,
so opening the y-axis has no visual side effect on the rounded corners.

### Removing Sizing Properties

Matching mantine-adapter's `Chip`: Figma tokens export explicit height/padding vectors rather than
string size variants (`sm`/`md`/`lg`), so `size` is omitted from `RecursicaChipProps` entirely.

### A non-interactive chip still looked clickable, and had a phantom Tab stop (Matt Massey, 2026-08-18)

A `Chip` with no `onDelete`/`onClick`/`onChange` (e.g. `FileUpload`'s `readOnly` file list) still
showed a pointer cursor on hover — `.root.root` hardcoded `cursor: pointer` unconditionally, with
no notion of whether the chip actually did anything. Added an `isInteractive` check (mirroring the
one added to mantine-adapter's `Chip`, see its `CHIP_IMPLEMENTATION_NOTES.md`) based on
`onDelete`/`onClick`/`onChange` — this adapter's `Chip` has no `checked`-driven native-input case to
misread the way Mantine's did, since MUI's `Chip` has no real underlying form control. A new
`data-interactive` attribute (set from `isInteractive`) gates `cursor: pointer` in CSS; without it,
the chip falls back to whatever MUI's own non-clickable `Chip` renders as (no cursor override, no
`ButtonBase`).

Separately, `.children`'s `overflow-x: hidden` (added for ellipsis truncation) made it a scroll
container, and Chromium auto-adds scroll containers with actually-overflowing content to the Tab
order — with no `tabindex` attribute at all — so a solo Tab press could land on a chip's plain
filename text before ever reaching a real control. Switched to `overflow-x: clip`, which doesn't
establish a scrollport (same visual clipping, still x-axis only per the descender fix above), so
it's no longer a focus candidate. This affected every chip with long enough content, not just
read-only ones — see `FileUpload`'s own `IMPLEMENTATION_NOTES.md` for how it surfaced there.

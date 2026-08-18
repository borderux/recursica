# Chip Implementation Notes

## Architecture decisions

### Mantine DOM Structure & Label Overrides

Mantine's `<Chip>` behaves like an input element (`radio` or `checkbox`). Under the hood, it renders:

1. `.mantine-Chip-root` (wrapper)
2. `input` (hidden visual structure)
3. `.mantine-Chip-label` (The actual visible button-like pill)

Because the `.label` is the primary visual surface and handles Mantine's built-in `:hover` and active states, we direct our Recursica styling natively to `.label`.

### Icon and Remove Implementations

To achieve this without breaking Mantine's `Chip` input architecture, we wrapped the internal `children` using a standard `span` DOM strategy:

```tsx
<span className={styles.innerWrapper}>
  {icon}
  <span className={styles.children}>{children}</span>
  {onRemove}
</span>
```

#### Intermediate Children Wrapper Span display fix:

Mantine internally wraps the children passed to `Chip` in a default `<span>` which has `display: inline`. This intermediate `span` inherits the `line-height` of the `.label` container, causing the computed height of the Chip to be ~2px taller than expected. To address this, `.label > span:not(.mantineIconWrapper)` is targeted to force `display: inline-flex; align-items: center;` on that intermediate wrapper `span`, allowing it to collapse perfectly to the `16px` height of the `innerWrapper`.

### Accessibility of Remove Action

Because the Chip fundamentally functions as a `<label>` linked to an `<input>`, placing a raw interactive element like `<button>` directly inside the standard Chip sub-tree violates nested interactive element ARIA constraints in strict validators.
To accommodate this, the visual "close" icon uses a `<span>` element configured with `role="button"` and `tabIndex={0}` to hook into standard keyboard activations without triggering generic nested `<form>` conflicts native to Mantine's baseline constraints.

### Removing Sizing Properties

During implementation, the parsed Figma design tokens natively exported specific height/padding vectors dynamically (e.g., `--recursica_ui-kit_components_chip_properties_icon-size`) rather than explicit string variants (`sm`, `md`, `lg`). Therefore, we omitted `size` conceptually from the `RecursicaChipProps` wrapper to lock down size evaluation natively against the active layer variables.

### Long-label truncation was hiding the remove icon (Matt Massey, 2026-08-17)

`.children` already had `text-overflow: ellipsis; overflow: hidden; white-space: nowrap;`, but
neither it nor its parent `.innerWrapper` had `min-width: 0` — a flex child without that refuses
to shrink below its intrinsic (full, unwrapped) content width, so `text-overflow: ellipsis` never
actually engaged. A long label overflowed the flex row instead, and since `.removeIcon` had no
`flex-shrink: 0`, it got squeezed out of the clipped (`max-width`-bounded) chip entirely. Fixed by
adding `min-width: 0` to `.innerWrapper`/`.children` and `flex-shrink: 0` to `.leadingIcon`/
`.removeIcon`. Reproduces easily with `FileUpload`'s file list, since its chip `max-width`
(`--recursica_ui-kit_components_chip_properties_max-width`, 200px) is small enough that most real
filenames overflow it.

### Descenders were being clipped on `.children` and `.root` (Matt Massey, 2026-08-18)

A label with a descender (e.g. the "g" in "image.png") had its bottom clipped off. Both `.children`
and `.root.root` set plain `overflow: hidden` — needed on the x-axis so `.children`'s
`text-overflow: ellipsis` (and `.root`'s `max-width`) actually clip long labels, but clipping the
y-axis too cuts off any glyph ink that extends past the line box, which happens whenever the
`text_line-height` token is tighter than the font's natural ascent+descent. Fixed by splitting both
into `overflow-x: hidden; overflow-y: visible;` — ellipsis/max-width truncation is unaffected (still
x-axis only), but descenders can now paint outside a too-tight line box instead of being clipped.
`.root` has no background/border-radius of its own to protect (that's `.label`), so opening its
y-axis has no visual side effect.

### Roving tabindex support for chip groups (Matt Massey, 2026-08-17)

Added two optional pass-through props — `removeTabIndex` and `removeIconRef` — purely so a parent
managing a _group_ of chips (e.g. `FileUpload`'s file list, see its own `IMPLEMENTATION_NOTES.md`)
can implement roving-tabindex/arrow-key navigation across them: set `removeTabIndex={-1}` on every
chip but the currently-active one, and use `removeIconRef` to move real DOM focus there
imperatively on arrow-key press. Both are no-ops for a standalone `Chip` (defaults: `tabIndex={0}`,
no ref) — this doesn't change any existing single-chip behavior.

### `isInteractive` was measuring the wrong signal, and leaked a pointer cursor + phantom Tab stop (Matt Massey, 2026-08-18)

A `Chip` rendered with `checked` but no real handler (e.g. `FileUpload`'s `readOnly` file list —
`<Chip checked={false} tabIndex={-1}>`, no `onRemove`) still looked and behaved clickable, from two
separate bugs:

- `isInteractive` treated `checked !== undefined` (even `false`) as proof of interactivity. That's
  the wrong signal — a `checked`-controlled chip with no `onChange` can't actually be toggled by a
  click (Mantine's `useUncontrolled` discards the click when `value` is externally controlled), so
  clicking it does nothing observable regardless. `isInteractive` now only looks at whether
  something actually responds: `onRemove`, `onClick`, or `onChange`.
- `.label.label` never set its own `cursor`, so Mantine's base style (`cursor: pointer`, hardcoded
  on the underlying `mantine-Chip-label` class) always leaked through, independent of whether the
  chip was actually interactive. Reset it to `cursor: default` and added a `data-interactive`
  attribute (driven by the fixed `isInteractive` above, set via `wrapperProps` on `MantineChip` so
  it lands on `.root`) that re-enables `pointer` via `.root[data-interactive] .label.label` only
  when there's a real handler.

Separately, `.children`'s `overflow-x: hidden` (added for ellipsis truncation) made it a scroll
container, and Chromium auto-adds scroll containers with actually-overflowing content to the Tab
order — with no `tabindex` attribute at all — so a solo Tab press could land on a chip's plain
filename text before ever reaching a real control. Switched to `overflow-x: clip`, which doesn't
establish a scrollport (same visual clipping, still x-axis only per the descender fix above), so
it's no longer a focus candidate. This affected every chip with long enough content, not just
read-only ones — see `FileUpload`'s own `IMPLEMENTATION_NOTES.md` for how it surfaced there.

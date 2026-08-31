# Timeline Implementation Notes

## Architecture

Unlike Mantine, `@mui/lab`'s `TimelineItem` has no built-in bullet/connector — it only
composes whatever you nest inside it. `TimelineItem.tsx` renders `TimelineSeparator` >
`TimelineDot` (`.itemBullet`) + `TimelineConnector` (`.itemConnector`), and `TimelineContent`
(`.itemBody`) containing the `title`/description/`timestamp` nodes, to reproduce Mantine's
single-component bullet + connecting-line structure.

- `Timeline.tsx` computes `active`/`isLast` per item (Mui has no `active` concept at all) and
  injects them into each `Timeline.Item` as internal `__active`/`__isLast` props, mirroring
  Mantine's own `cloneElement` pattern for propagating active state down to children.
- `data-active` / `data-variant` are set directly on `TimelineItem`'s real `li` root and
  consumed via plain descendant selectors (`.item[data-active] .itemBullet`, etc.) in
  `Timeline.module.css` — Mui's `TimelineItem` only defines a `root` classes slot, so (unlike
  Mantine) passing a `classes` object with `item`/`itemBullet`/`itemBody`/... keys is a no-op;
  those class names must be applied as plain `className`s on the elements we render ourselves.
- The last item omits `TimelineConnector` entirely so no trailing line renders past it.
- `Timeline.module.css` neutralizes Mui's `TimelineItem::before` opposite-content spacer
  (`flex: 0; padding: 0`), which otherwise pushes the separator/content right since this
  adapter never renders `TimelineOppositeContent`.

## Limitations & Missing Tokens

- **Avatar Bullet Size**: There is no specific pixel variable provided for the Avatar bullet size in the UI kit tokens (`avatar-size` evaluates to `"default"`). To maintain exact mathematical centering with the connector line, the CSS falls back to inheriting the `default` bullet size (`20px`) for avatar nodes natively. If users supply a custom sized `img` tag, it must adhere to inline structural constraints or flex mappings.

## Connector fell short of the next bullet (source-of-truth audit, 2026-08-30)

`.root` spaces items with a real flex `gap` (`item-gap`) instead of Mui's own zero-gap default,
so each `<li>` sits with actual whitespace before the next one. `TimelineConnector` is Mui's own
`flex: 1` element that only fills its _own_ `<li>`'s content height (bounded by `TimelineItem`'s
row `align-items: stretch` matching `TimelineContent`'s height) — it always ended flush with its
own item's bottom edge, `item-gap` short of the next item's bullet. Fixed with `margin-bottom:
calc(-1 * item-gap)` on `.itemConnector`: flexbox's remaining-space distribution accounts for
margins when growing a `flex: 1` item, so a negative margin here hands the connector that much
extra grow height while pulling the _container's_ own computed size back in by the same amount —
net effect, the rendered line's box is genuinely `item-gap` taller and visually reaches the next
bullet, confirmed via `getBoundingClientRect()` (connector height 58.8px → 90.8px, exactly +32px
== the `item-gap` token value). Mantine's equivalent isn't a flex gap at all — it overrides
Mantine's own `--mantine-spacing-xl` (which natively drives both `.item`'s margin-top and the
connector's negative-bottom bridging offset together) — but the net visual result matches.

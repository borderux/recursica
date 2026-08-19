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

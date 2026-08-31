# Panel – Implementation Notes

Decisions and design tweaks strictly tailored for the UI Kit's Panel wrapped against `@mui/material`. This is a living document that tracks _why_ specific logic decisions exist.

---

## 1. Mapping to MUI Drawer

**Decision:** Panel maps to MUI's `Drawer` component, not `Paper` or `Card`.

**Implementation:** Per the Recursica design system specification, "Panels slide in or expand from the edge of the screen to reveal additional content or functionality." This is the exact behavior of MUI's `Drawer` component, which provides:

- Slide-in animation from any screen edge (using the `anchor` prop)
- Backdrop/overlay support
- Focus trap and overlay portal management
- Internal scroll lock when open

---

## 2. Token Namespace: `panel`

**Decision:** The CSS module exclusively uses variables from the `--recursica_ui-kit_components_panel_*` namespace.

**Implementation:** The Recursica token system defines the `panel` namespace covering:

- Geometry: border-radius, border-size, min-width (200px), max-width (960px)
- Content padding: content-horizontal-padding (xl), content-vertical-padding (lg)
- Header/Footer padding: header-footer-horizontal-padding (xl), header-footer-vertical-padding (md)
- Spacing: header-close-gap (md), footer-button-gap (md)
- Divider: divider-size (1px), divider-color
- Elevation: elevation-3
- Colors (layer-aware): background, border-color, content, divider-color, header-footer-background, title
- Non-CSS: header-style ("h3")

No tokens from other component namespaces are referenced.

---

## 3. Default Placement Override

**Decision:** Use `placement` instead of `position` for configuring slide-out direction, and default it to `"right"`.

**Implementation:** The prop was renamed from `position` to `placement` to prevent collision with the CSS `position` keyword, which is strictly blocked by the styling gatekeeper (`BLOCKED_STYLING_KEYS`). This allows configuring the drawer direction natively while maintaining strict design-system boundaries. The `placement="right"` default is mapped internally to MUI Drawer's `anchor` prop before any other sanitized props are applied. Right-side panels are the most common pattern for supplementary content, settings, and detail views.

---

## 4. Custom Panel.Footer

**Decision:** A custom `Panel.Footer` sub-component is provided. MUI's Drawer does not have a native footer.

**Implementation:** `Panel.Footer` is a `<div>` with styling referencing Recursica CSS variables for:

- `header-footer-background` and `header-footer-padding` tokens
- Top divider using `divider-size` and `divider-color`
- `footer-button-gap` for action button spacing
- `margin-top: auto` to push the footer to the bottom

---

## 5. Visibility Mapping (`opened` -> `open`)

**Decision:** Accept `opened` prop to match the standard Recursica component API.

**Implementation:** MUI Drawer natively expects the `open` boolean prop. The wrapper maps the incoming framework-agnostic `opened` prop to MUI's `open={Boolean(opened)}`, allowing consistent usage across both adapter implementations.

---

## Panel covered the whole viewport with no header (Matt Massey, 2026-08-30)

**Symptom:** `ui-kit-panel--default` rendered as an unstyled white box covering the entire
viewport (full width and height, no border/radius/shadow, no dark overlay), with no header,
title, or close button visible at all — not merely off-screen, never rendered.

**Root cause:** Two compounding bugs, both from writing this component as if MUI's `Drawer`
had Mantine's convenience API:

1. `classes={{ content, header, title, body, inner }}` — MUI's `Drawer` `classes` prop only
   recognizes its own slot names (`root`, `paper`, `docked`, `paperAnchorRight`, ...). It has no
   `content`/`header`/`title`/`body`/`inner` slots the way Mantine's `classNames` does, so every
   key in that object was silently ignored — none of this file's CSS Module classes were ever
   attached to any DOM node. Confirmed via the rendered Paper's `className`: only MUI's own
   default `MuiPaper-root MuiDrawer-paper MuiDrawer-paperAnchorRight` classes were present.
2. `title`, `withOverlay`, `withCloseButton` were spread straight through onto `<MuiDrawer>` as
   if it were Mantine's `<Drawer title="..." withCloseButton>`, which builds a Header/Title/
   CloseButton internally from those props. MUI's `Drawer` has no such feature — it only takes
   `children`. `title` landed as a plain HTML `title` (tooltip) attribute on the root div;
   `withOverlay`/`withCloseButton` were dropped entirely (not valid DOM or Drawer props). No
   header ever rendered.

Both bugs together meant Paper had zero width/height/border constraints of its own (MUI's
default temporary-variant Paper only fixes position, not size) and no header to visually anchor
against — hence "covers the whole viewport."

**Fix:** Rebuilt Panel the same way `Modal.tsx` builds its header/body/footer — as real JSX
children of `<MuiDrawer>`, not through the `classes` prop:

- `title`, `withOverlay`, `withCloseButton`, `onClose`, `children` are now destructured and used
  directly: a manually-built `.header` div (title + close `IconButton`, only rendered when
  `title` or `withCloseButton` is set) and `.body` div wrap the real children; `withOverlay`
  maps to MUI's own `hideBackdrop={!withOverlay}`.
- `classes` now only maps `paper` (MUI's actual slot) to a new `.paper` rule that zeroes out
  Paper's own default background/box-shadow, so the box-model chrome (border, radius, shadow,
  `min-width`/`max-width` bounds) lives entirely on the new `.content` wrapper div rendered
  inside Paper — mirroring where Mantine's own `.content` slot sits (it wraps header/body
  already), just as an explicit element instead of a slot name MUI doesn't have.
- Added `display: flex` + `justify-content: space-between` to `.header` and a `.close` rule —
  Mantine's own `Drawer.Header` is flex out of the box; this manually-built div needed it
  declared. No dedicated close-button token namespace exists for Panel (Mantine's own Panel
  doesn't style one either — it renders Mantine's plain default `CloseButton`), so `.close` only
  sets `flex-shrink: 0` and reuses a plain `IconButton`.
- Removed the `.inner { left: 0 }` rule — that was a Mantine-only positioning hack (`Drawer.Inner`
  has no MUI equivalent; MUI's own `paperAnchorLeft`/`paperAnchorRight` classes already position
  Paper correctly).

Verified live in Storybook against `@recursica/mantine-adapter`'s Panel for `Default`,
`LeftPlacement`, `ScrollableContent`, and `LongTitle` — header renders, close button works,
title truncation and the sticky scrolling footer all behave correctly. Width is now bounded by
`--recursica_ui-kit_components_panel_properties_min-width`/`max-width` (200–960px) via
shrink-to-fit, same mechanism as Modal's `.content`; this is narrower/wider than mantine's own
default rendered width in some stories, because Mantine's Panel CSS (identical file, shared
copy) never added the `flex: 0 1 auto` override Mantine's own Modal has to make width
content-driven instead of Mantine's fixed `--drawer-size` default — that's a source-of-truth-side
gap, out of scope here.

---

## `.titleTruncate` descender clipping (Matt Massey, 2026-08-28)

`.titleTruncate` used plain `overflow: hidden` to make `text-overflow: ellipsis` work, which also
clips descenders (e.g. the "g" in a long title) whenever `text_line-height` is tighter than the
font's natural ascent+descent. Switched to `overflow: clip; overflow-clip-margin: 0.35em;` — same
truncation, but ink can bleed slightly past the line box before it's actually clipped.
Project-wide fix; see Chip's `CHIP_IMPLEMENTATION_NOTES.md` for the original discovery.

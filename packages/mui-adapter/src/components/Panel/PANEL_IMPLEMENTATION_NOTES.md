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

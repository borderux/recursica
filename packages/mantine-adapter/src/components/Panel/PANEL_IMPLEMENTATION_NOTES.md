# Panel – Implementation Notes

Decisions and design tweaks strictly tailored for the UI Kit's Panel wrapped against `@mantine/core`. This is a living document that tracks _why_ specific logic decisions exist.

---

## 1. Mapping to Mantine Drawer

**Decision:** Panel maps to Mantine's `Drawer` component, not `Paper` or `Card`.

**Implementation:** Per the Recursica design system specification, "Panels slide in or expand from the edge of the screen to reveal additional content or functionality." This is the exact behavior of Mantine's `Drawer` component, which provides:

- Slide-in animation from any screen edge
- Overlay/backdrop
- Portal rendering
- Focus trapping
- Scroll locking
- Close button and title in header

Paper and Card are static containers; Drawer is an overlay that matches Panel's defined behavior.

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
- Non-CSS: header-style ("h3") — see §7

No tokens from other component namespaces are referenced.

---

## 3. ClassNames Mapping to Drawer

**Decision:** Panel maps CSS module classes to Mantine Drawer's stylesNames.

**Implementation:** The Drawer stylesNames used are:

- `content` — Outer container (background, border, elevation)
- `header` — Title bar with close button (padding, divider, gap)
- `title` — Title text color
- `body` — Scrollable content area (padding)

Other stylesNames (`overlay`, `root`, `inner`, `close`) are left to Mantine defaults.

---

## 4. Default Position Override

**Decision:** Recursica defaults `position` to `"right"`. Mantine defaults to `"left"`.

**Implementation:** The `position="right"` default is set before the prop spread, so developer-provided `position` values still take precedence. Right-side panels are the most common pattern for supplementary content, settings, and detail views.

---

## 5. Custom Panel.Footer

**Decision:** A custom `Panel.Footer` sub-component is provided. Mantine's Drawer does not have a native footer.

**Implementation:** `Panel.Footer` is a `<div>` with inline styles referencing Recursica CSS variables for:

- `header-footer-background` and `header-footer-padding` tokens
- Top divider using `divider-size` and `divider-color`
- `footer-button-gap` for action button spacing
- `margin-top: auto` to push the footer to the bottom

Inline styles are used instead of a CSS module class because the footer is rendered inside the Drawer's `<body>` element, and the CSS variables are applied to the body's parent container. The inline styles ensure the footer correctly references the panel tokens regardless of DOM position.

---

## 6. Hardcoded Values

### `border-style: solid` (CSS module, `.content`)

Mantine's Drawer content does not set `border-style` natively. Without this, the border-width and border-color tokens have no visible effect. Same pattern as Card, Menu, HoverCard, Tooltip.

---

## 7. header-style Token Reference Bug

**Decision:** The `header-style: "h3"` token currently outputs as a raw string in the UI kit JSON, breaking our PostCSS compiler when mapped as CSS variable fallbacks. We have explicitly removed these fallbacks.

**Implementation:** The design system intended for the `header-style` token to act as a proper typography reference, which would compile into fully expanded properties like `--recursica_ui-kit_components_panel_properties_header-style_fontFamily`. Because the JSON export currently passes it as the raw string `"h3"`, attempting to bind to the non-existent variables breaks the build plugin. Until the JSON export is fixed to compile proper reference nodes, we are stripping typography bindings from the `.title` class and relying purely on `color` and Mantine's defaults.

---

## 8. Panel Types: Standard vs Scrollable

**Decision:** Both standard and scrollable types are supported natively.

**Implementation:** Per the Recursica specification:

- **Standard** — All content visible without scrolling. The default behavior when content fits.
- **Scrollable** — Internal scrollbar enabled when content exceeds the panel height. Header and footer CTAs remain pinned.

Mantine's Drawer handles this automatically — the `body` section scrolls when content overflows, while the `header` remains fixed. The `Panel.Footer` uses `margin-top: auto` to stay at the bottom.

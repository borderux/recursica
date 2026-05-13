# Button Component Implementation Notes

**Implementation Philosophy:**
The Button component serves as a foundational building block in Recursica. This implementation wraps the `@mui/material/Button` component but **disables its native visual heuristics entirely.**

We explicitly pass `disableRipple` and `disableElevation` to block MUI's dynamic behaviors. Furthermore, we intentionally **do not** map our `variant` or `size` properties to MUI's native `variant` or `size` props because doing so would trigger MUI's internal CSS engines to inject styles that clash with our strict design tokens.

**Styling Strategy:**

- We utilize `filterStylingProps` to prevent rogue injections of `sx`, `style`, or `className` properties that would violate the design system.
- All styling is controlled directly via CSS Modules, mapping DOM attributes like `data-variant` and `data-size` to pure CSS selectors.
- Hover states are managed with a standard `::after` pseudo-element overlay hack rather than relying on native hover psuedo-selectors modifying background-color directly. This allows a clean `opacity` overlay based on the provided design tokens, which guarantees identical visual feedback behavior across all underlying themes without overriding background hues manually.
- The polymorphic `component` prop natively supported by MUI is safely forwarded to allow correct semantics (e.g. rendering as an `<a>` tag or using a router `Link`).

**Accessibility:**

- We inject a development-time warning explicitly requiring `aria-label` when the component detects an icon-only configuration.

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

---

## Loader color contrast

**Decision:** When a Button is in a loading state, the `Recursica Loader` component is injected via the `loadingIndicator` prop. The `Loader` component strictly defines its own colors and styles per variant, meaning it does not automatically inherit the text color (`currentColor`) from the Button.

**Constraint:** This can lead to contrast issues (e.g., a blue dots loader inside a solid blue button). Design has explicitly decided not to address this at the moment. As such, developers using the `loading` prop must be aware that the loader's color is fixed by its internal tokens, not by the button's context.

---

## Loading state enforces disabled state

**Decision:** When `loading={true}` is passed to the Button, the component explicitly forces `disabled={true}` natively on the underlying element.

**Implementation:** This ensures that loading buttons automatically inherit the brand theme disabled opacities (via the `:disabled` CSS pseudo-class) rather than relying solely on MUI's internal loading opacity adjustments.

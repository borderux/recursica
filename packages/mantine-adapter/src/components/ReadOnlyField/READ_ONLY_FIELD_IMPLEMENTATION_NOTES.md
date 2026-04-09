# ReadOnlyField Implementation Notes

This document acts as a living record tracking edge cases and architectural choices made specific to the `ReadOnlyField` and its internal blocks (like `ReadOnlyTextField`).

## 1. Stripping Mantine Assumptions

Unlike standard input variables, standard HTML output `<p>` tags inherently carry margin and spacing assumptions from core browser stylesheets. To correctly map `ReadOnlyTextField` elements gracefully inside the generic `FormControlWrapper` bounded context, we hardcode resets:

- `margin: 0` explicitly strips block flow gap so `FormControlWrapper` handles vertical rhythm.
- `min-height`: Native `Input` boxes typically have baseline padding borders. We map directly to `var(--recursica_ui-kit_components_read-only-field_properties_min-height)` to ensure a side-by-side editable `TextField` and `ReadOnlyField` perfectly share roughly identical visual heights.

## 2. Unidirectional Editable Mode

The main wrapper intercepts `readOnly` boolean blocks, maintaining its own `isReadOnly` state. Natively, if a user clicks an exposed 'Edit' action (like our legacy SVG or custom `labelActionArea`), the context permanently switches to active.
There is intentionally no built-in reverse toggle inside typical field bindings (like input "Blur") to revert state. Parents must pass external controls to `readOnly` forcing the internal hooks to reset via standard `useEffect` propagation.

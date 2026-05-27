# Loader Implementation Notes

## Architecture & Integration

The `Loader` component acts as a strictly tokenized wrapper bridging the Recursica UI-Kit `loader` variables to the generic Mantine `@mantine/core` `Loader` primitive.

### Key Decisions:

- **Variant Mapping:** Recursica's `variant` directly proxies to Mantine's `type` prop for `"oval" | "bars" | "dots"`.
- **Property Overrides Disabled:** Natively overriding specific structural variants directly on the JSX interface like `thickness` and `borderRadius` has been intentionally omitted. Component rendering relies entirely on variables exposed by the underlying UI Kit mappings tied to the size prop.

### Token Mapping:

Sizes are bound through `data-size` attributes (`sm`, `md`, `lg` parsing to target `<div data-size="small">`, etc.).

Mantine natively sets sizing dynamically at the component root and parses thickness/variants differently natively (e.g., `oval` styles its geometry strictly via CSS `border`, while `bars` and `dots` utilize specific DOM inner spans `span.dot` / `span.bar`).

#### Specific CSS Targeting Hacks Used

- `border-width` and `border-radius` structurally style the `thickness` and `border-radius` configuration of the `oval` variant on the `::after` pseudo-element by resolving `--recursica_ui-kit_components_loader_variants_sizes_..._properties_thickness` and `_border-radius`.

### Unsupported Properties

- **xs and xl Sizing:** These sizes are explicitly unsupported in the Recursica standard logic (as surfaced in `filterStylingProps` and UI Kit mappings). Attempting to use them will safely default back or fallthrough statically unless defined later. See `COMPONENT_ISSUES.md`.

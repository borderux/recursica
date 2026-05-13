# Modal Implementation Notes

## Architecture

The `Modal` component strictly wraps Mantine's `<Modal>` primitive. We strip Mantine's abstract native styling props (`size`, `radius`, `shadow`) via the `overStyled` interface and strictly inject CSS variable definitions onto the internal node abstractions (`.content`, `.header`, `.body`, `.title`).

## Limitations & Structural Decisions

### 1. Stripped `size` Prop

Mantine natively exposes an abstract `size` prop (`"sm" | "md" | "lg" | "xl"`) that scales the Modal geometry. The Recursica UI Kit explicitly dictates strict geometric bounding boxes: `max-width: 960px` and `min-width: 304px`. To enforce absolute parity with the design system, the `size` prop has been intentionally omitted from the component's interface. The width of the Modal will scale fluidly strictly between these Figma-driven pixel limits.

### 2. Scroll Dividers behavior

Mantine internally handles scroll state natively, dynamically showing/hiding a divider line when content overflows in `.body`. This logic is tightly coupled to React DOM measurements internally. Our component inherits this dynamic behavior rather than statically rendering a permanent divider, matching Mantine's robust overflow UX. However, we aggressively override the generated `border-bottom` via CSS modules to ensure that when it _does_ appear, it correctly utilizes the `--recursica_ui-kit_components_modal_colors_scroll-divider` variable and `--recursica_ui-kit_components_modal_properties_scroll-divider-thickness` token.

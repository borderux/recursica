# Loader Implementation Notes

## Architecture & Integration

The `Loader` component for the MUI adapter has been completely hand-coded from scratch using pure CSS and basic HTML `<span>` elements. It explicitly **does not** use MUI's native `<CircularProgress>` component.

This was a deliberate architectural decision to ensure 100% feature and visual parity with the `mantine-adapter`.

### Key Decisions:

- **Bypassing Native Components:** MUI's native loaders (like `<CircularProgress>`) are built using complex animated SVGs and only support a circular "oval" shape. Since the Recursica design system mandates `oval`, `bars`, and `dots` variants, relying on MUI's primitives would have forced a fragmented architecture where `oval` used MUI but `bars` and `dots` were hand-coded.
- **Parity with Mantine:** To guarantee identical animation timing, easing curves, and DOM structures across frameworks, the CSS keyframes and layout strategies used internally by Mantine's `<Loader>` were extracted and directly replicated in this adapter's `Loader.module.css`.

### Token Mapping:

Sizes are bound through `data-size` attributes (`sm`, `md`, `lg` parsing to target `<div data-size="small">`, etc.).

- **Oval Variant:** Uses a CSS spinning `::after` pseudo-element. To avoid CSS border inheritance bugs when computing tokenized border-widths, a custom `--loader-thickness` CSS variable is used to bridge the token into the spinning element.
- **Bars & Dots Variants:** Render three internal `<span />` elements sequentially, styled via `Loader.module.css` to handle individual keyframe delays for bouncing or fading animations.

### Color Contrast Rules:

Loaders are hardcoded to map to their explicitly defined design tokens (e.g., `--recursica_ui-kit_components_loader_properties_indicator-color`). By default, they do **not** inherit `currentColor`.

When injected into components like the `Button` (where contrast issues may arise against solid backgrounds), it is the responsibility of the parent component (e.g., `Button.module.css`) to use contextual CSS overrides to force `--loader-color: currentColor !important` if necessary.

# Pagination Implementation Notes

## Architecture Decision: CSS Inheritance vs. Composition

The Figma design tokens for the `Pagination` component dictate that pagination pages perfectly mimic `Button` variants (e.g. `active-pages_style: "solid"`, `inactive-pages_style: "outline"`, `navigation-controls_style: "text"`).

As of the `1.2.0` scoped CSS update, the Figma exporter automatically handles these variants. It flattens and aliases the referenced Button properties directly into the `Pagination` component's variable namespace.

We opted to use Mantine's native `PaginationControl` components to ensure all DOM structure, focus management, and accessibility attributes are preserved natively without us needing to carefully rebuild `Pagination.Items` mappings.

To honor the Figma design intents while using Mantine's raw `<button>` elements:

1. We inherit and map all natively scoped `Pagination` variant styles (small typography, outline/solid/text colors, and hover overlays) directly into `.control` and `.control[data-active]` within `Pagination.module.css`. We do not need to manually reference `Button` variables cross-component.
2. We inject `data-variant="text"` via `getControlProps` onto the navigation buttons so that they inherit the explicitly aliased text style variables (`navigation-controls`) defined by the UI Kit for pagination.

This achieves exact optical alignment with the tokens while maintaining Mantine's robust internal event handling for pagination.

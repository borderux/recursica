# Breadcrumb Implementation Notes

## Missing Variants and Sizes

The `Breadcrumb` currently does not establish any size (`xs`, `sm`, etc.) or variant variables in the underlying design tokens (`recursica_ui-kit.json`). Only basic structural definitions for `padding` and `item-gap` exist. Because of this, the `size` and `variant` properties have been explicitly omitted from the passed mantine props.

## Gap Styling

We attach `gap` to `.root` directly within `.module.css`. Mantine's inner `separator` divs can natively accept our CSS variables for structural layout.

## Composition and Separators

We preserve standard hierarchical composition based on Mantine's defaults. The component natively accepts typical anchor tags as children without wrapping them in structural spans, allowing developers to utilize `Link` wrappers as needed contextually.
The separator character is inherited natively from Mantine's default configuration (`/`) unless overridden by passing `separator={<Icon />}` to the component props.

## Current-page Crumb Is Plain Text

The component itself is unopinionated — it renders whatever `children` a caller passes, so whether the last crumb is a link is a consumer choice, not something `Breadcrumb.tsx` enforces. The story's `items` convenience prop previously wrapped every crumb (including the last) in a `Link`. Fixed: the story now renders the last crumb as a plain `<span>` instead of a `Link`, since it represents the current page and shouldn't be clickable — matches standard breadcrumb UX.

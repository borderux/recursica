# Link Component Implementation Notes

## Missing States in Design Tokens

Currently, the design tokens (`recursica_variables_scoped.css`) only provide states for:

- `default`
- `hover`
- `visited`
- `visited-hover`

There are no tokens for the `active` or `focus` states. If these are needed, they must be added to the Figma variables and exported via the token pipeline. The component relies on the browser's default focus outline for accessibility unless overriden by a global reset.

## Overriding Mantine's underline Prop

Mantine's `Anchor` component uses `underline="hover"` by default. Because our design system specifies exact `text-decoration` styles via CSS tokens, we explicitly pass `underline="never"` to the underlying Mantine component. This prevents Mantine from injecting its own text-decoration inline or via generic classnames, ensuring our scoped CSS remains the single source of truth.

## Base Layout

Mantine's `Anchor` renders an inline element by default and does not natively support `leftSection` like the `Button` component. To support an optional `icon` alongside the text, we enforce a baseline layout of `display: inline-flex` and `align-items: center` in `Link.module.css`.

When an icon is present, the component conditionally passes a `data-has-icon` attribute to the root element. The CSS module uses this attribute to apply the `icon-text-gap` token via the CSS `gap` property.

## Inner Wrappers

The icon and children are wrapped in internal `<span>` tags (`.iconWrapper` and `.labelText` respectively). This follows the component development guide for structural robustness, allowing us to enforce specific sizing on the icon and intrinsic text truncation behavior if the link is placed in a bounded container.

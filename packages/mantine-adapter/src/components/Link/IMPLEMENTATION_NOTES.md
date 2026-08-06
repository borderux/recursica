# Link Component Implementation Notes

## States in Design Tokens

The design tokens (`recursica_variables_scoped.css`) provide the base link styling directly on `--recursica_ui-kit_components_link_properties_*` (no distinct `default` state), plus a `visited` variant that overrides only `colors_text-color`/`colors_icon-color`. There is no per-state token for `hover` anymore (a prior schema version had one); the component currently applies no distinct hover treatment beyond the browser's native `cursor: pointer`. There are no tokens for `active` or `focus` either; the component relies on the browser's default focus outline for accessibility unless overridden by a global reset.

## Overriding Mantine's underline Prop

Mantine's `Anchor` component uses `underline="hover"` by default. Because our design system specifies exact `text-decoration` styles via CSS tokens, we explicitly pass `underline="never"` to the underlying Mantine component. This prevents Mantine from injecting its own text-decoration inline or via generic classnames, ensuring our scoped CSS remains the single source of truth.

## Base Layout

Mantine's `Anchor` renders an inline element by default and does not natively support `leftSection` like the `Button` component. To support an optional `icon` alongside the text, we enforce a baseline layout of `display: inline-flex` and `align-items: center` in `Link.module.css`.

When an icon is present, the component conditionally passes a `data-has-icon` attribute to the root element. The CSS module uses this attribute to apply the `icon-text-gap` token via the CSS `gap` property.

## Inner Wrappers

The icon and children are wrapped in internal `<span>` tags (`.iconWrapper` and `.labelText` respectively). This follows the component development guide for structural robustness, allowing us to enforce specific sizing on the icon and intrinsic text truncation behavior if the link is placed in a bounded container.

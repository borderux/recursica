# Chip Implementation Notes

## Architecture decisions

### Mantine DOM Structure & Label Overrides

Mantine's `<Chip>` behaves like an input element (`radio` or `checkbox`). Under the hood, it renders:

1. `.mantine-Chip-root` (wrapper)
2. `input` (hidden visual structure)
3. `.mantine-Chip-label` (The actual visible button-like pill)

Because the `.label` is the primary visual surface and handles Mantine's built-in `:hover` and active states, we direct our Recursica styling natively to `.label`.

### Icon and Remove Implementations

The Recursica specifications for the Chip component define `--chip-icon` and `--chip-close` which map to leading and trailing states.
To achieve this without breaking Mantine's `Chip` input architecture, we wrapped the internal `children` using a standard `span` DOM strategy:

```tsx
<span className={styles.innerWrapper}>
  {icon}
  <span className={styles.children}>{children}</span>
  {onRemove}
</span>
```

### Accessibility of Remove Action

Because the Chip fundamentally functions as a `<label>` linked to an `<input>`, placing a raw interactive element like `<button>` directly inside the standard Chip sub-tree violates nested interactive element ARIA constraints in strict validators.
To accommodate this, the visual "close" icon uses a `<span>` element configured with `role="button"` and `tabIndex={0}` to hook into standard keyboard activations without triggering generic nested `<form>` conflicts native to Mantine's baseline constraints.

### Removing Sizing Properties

During implementation, the parsed Figma design tokens natively exported specific height/padding vectors dynamically (e.g., `--recursica_ui-kit_components_chip_properties_icon-size`) rather than explicit string variants (`sm`, `md`, `lg`). Therefore, we omitted `size` conceptually from the `RecursicaChipProps` wrapper to lock down size evaluation natively against the active layer variables.

# @recursica/official-release

Official design tokens, CSS variables, and JSON metadata schemas for the Recursica design system.

This package serves as the single source of truth for Recursica's styles, colors, spacing, and typography. It is automatically installed as a dependency of the official UI adapters to ensure design tokens are aligned and version-locked with the component wrappers.

## Package Contents

- **`recursica_variables_scoped.css`**: Scoped CSS custom properties declaring the design system's variables.
- **`recursica_brand.json`**: Brand styling token definitions.
- **`recursica_tokens.json`**: Core layout and atomic token metadata.
- **`recursica_ui-kit.json`**: Global UI kit layout schemas.
- **`recursica.json`**: Version and project configuration.

---

## How It Works

### Automatic Setup (Postinstall)

When this package is installed in a host project (either directly or transitively via an adapter), a `postinstall` script runs automatically:

1. It locates the root of the host project.
2. If `recursica_variables_scoped.css` is **missing** in the host project root, the script automatically copies all 5 theme files from this package to the project root.
3. If the files are **already present**, the script does nothing (preventing it from overwriting any custom theme styles you have exported from Forge).

### Customization

The files distributed in this package are default starter tokens. To customize your theme:

1. Go to [Forge Recursica](https://forge.recursica.com).
2. Configure your design tokens, typography, and states.
3. Export the theme files directly into the root of your project (overwriting the default ones copied by this package).

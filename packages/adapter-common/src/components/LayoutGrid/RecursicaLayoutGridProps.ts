import React from "react";

/**
 * Props for the Recursica LayoutGrid layout component.
 *
 * Recursica's `layout-grids` tokens (column count, column-gutter, row-gutter, margin) are
 * design-system-managed, breakpoint-aware values applied via CSS variables, not integrator-facing
 * settings. For a fixed N-column grid, use the underlying UI kit's grid directly.
 *
 * Forge mapping (names in `recursica_ui-kit.json` / `--recursica_ui-kit_components_<contract>_*`):
 * - Not a Forge component: intentionally outside the UI kit, so it has no `ui-kit_components_*` contract.
 */
export interface RecursicaLayoutGridProps {
  /** Content inside the grid */
  children?: React.ReactNode;
}

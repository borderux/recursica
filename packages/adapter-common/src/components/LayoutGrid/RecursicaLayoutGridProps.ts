import React from "react";

/**
 * Props for the Recursica LayoutGrid layout component.
 *
 * Recursica's `layout-grids` tokens (column count, column-gutter, row-gutter, margin) are
 * design-system-managed, breakpoint-aware values applied via CSS variables, not integrator-facing
 * settings. For a fixed N-column grid, use the underlying UI kit's grid directly.
 */
export interface RecursicaLayoutGridProps {
  /** Content inside the grid */
  children?: React.ReactNode;
}

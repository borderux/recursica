import React from "react";

/**
 * Props for the Recursica Grid layout component.
 *
 * Recursica's `layout-grids` tokens (column count, column-gutter, row-gutter, margin) are
 * design-system-managed values applied via CSS variables, not integrator-facing settings — only
 * `columns` is exposed as an override, matching the pattern `RecursicaContainerProps.size` uses
 * for its own token-backed default.
 */
export interface RecursicaGridProps {
  /** Content inside the grid */
  children?: React.ReactNode;
  /** Number of columns in the grid. Defaults to the design system's default column count. */
  columns?: number;
}

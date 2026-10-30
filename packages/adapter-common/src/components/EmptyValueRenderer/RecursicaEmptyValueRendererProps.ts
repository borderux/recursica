import React from "react";

/**
 * Props for the Recursica EmptyValueRenderer component.
 *
 * Forge mapping (names in `recursica_ui-kit.json` / `--recursica_ui-kit_components_<contract>_*`):
 * - Not a Forge component: intentionally outside the UI kit, so it has no `ui-kit_components_*` contract.
 */
export interface RecursicaEmptyValueRendererProps {
  /** Fallback node to show when values are missing */
  fallback?: React.ReactNode;
}

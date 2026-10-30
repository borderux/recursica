import React from "react";

/**
 * Props for the Recursica Link component.
 *
 * Forge mapping (names in `recursica_ui-kit.json` / `--recursica_ui-kit_components_<contract>_*`):
 * - Contract `link`. Axis `states` visited has no prop; it is the browser's `:visited` state.
 */
export interface RecursicaLinkProps {
  /** Leading icon shown next to text link */
  icon?: React.ReactNode;
  /** Text or target elements */
  children?: React.ReactNode;
  /** Polymorphic tag type override */
  component?: React.ElementType;
}

import React from "react";

/**
 * Props for the Recursica Menu component.
 *
 * Forge mapping (names in `recursica_ui-kit.json` / `--recursica_ui-kit_components_<contract>_*`):
 * - Contract `menu`. Forge's `menu-item` is each Menu.Item (child of the Menu): `selection-states` (unselected, selected) and `states` disabled.
 */
export interface RecursicaMenuProps {
  /**
   * Overrides the dropdown's token-driven max-height with an explicit pixel (or other CSS
   * length) value. Escape hatch for callers that need an arbitrary menu height the design
   * tokens don't express; leave unset to use the token default.
   */
  maxHeight?: React.CSSProperties["maxHeight"];
}

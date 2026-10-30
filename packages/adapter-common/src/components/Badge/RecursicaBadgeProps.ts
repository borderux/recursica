/**
 * Props for the Recursica Badge component.
 *
 * Forge mapping (names in `recursica_ui-kit.json` / `--recursica_ui-kit_components_<contract>_*`):
 * - Contract `badge`. Axis `styles` ← `variant` (primary-color, warning, success, alert).
 */
export interface RecursicaBadgeProps {
  /**
   * Map to the component styles defined in variables
   *
   * Forge axis `styles`.
   */
  variant?: "alert" | "primary-color" | "success" | "warning" | (string & {});
}

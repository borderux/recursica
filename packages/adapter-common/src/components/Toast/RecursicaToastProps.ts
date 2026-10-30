/**
 * Props for the Recursica Toast notification component.
 *
 * Forge mapping (names in `recursica_ui-kit.json` / `--recursica_ui-kit_components_<contract>_*`):
 * - Contract `toast`. Axis `styles` ← `variant` (default, success, error).
 */
export interface RecursicaToastProps {
  /**
   * Visual semantic variant styles
   *
   * Forge axis `styles`.
   */
  variant?: "default" | "error" | "success" | (string & {});
  /** Forced disabled loading state property */
  loading?: false;
}

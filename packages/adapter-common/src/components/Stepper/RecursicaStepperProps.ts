/**
 * Props for the Recursica Stepper component.
 *
 * Forge mapping (names in `recursica_ui-kit.json` / `--recursica_ui-kit_components_<contract>_*`):
 * - Contract `stepper`. Axes: `sizes` ← `size` (small, large); `orientation` ← `orientation` (horizontal, vertical).
 */
export interface RecursicaStepperProps {
  /**
   * Visual size variant
   *
   * Forge axis `sizes`.
   */
  size?: "small" | "large";
  /**
   * Direction the steps are laid out in
   *
   * Forge axis `orientation` (horizontal, vertical).
   */
  orientation?: "horizontal" | "vertical";
}

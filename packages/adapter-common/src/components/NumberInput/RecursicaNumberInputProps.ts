/**
 * Props for the Recursica NumberInput component.
 *
 * Forge mapping (names in `recursica_ui-kit.json` / `--recursica_ui-kit_components_<contract>_*`):
 * - Contract `number-input`. Axes: `layouts` (stacked, side-by-side) ← `formLayout`; `states` error ← `error`, disabled ← `disabled`.
 */
export interface RecursicaNumberInputProps {
  /** Enables/disables the controls to increment and decrement the value */
  hideControls?: boolean;
  /** Content rendered on the left side of the input (e.g. icon). Naming rationale: see `RecursicaTextFieldProps.leftSection`. */
  leftSection?: React.ReactNode;
  /** Content rendered on the right side of the input (e.g. percentage sign). Same rationale as `leftSection` above. */
  rightSection?: React.ReactNode;
  /** Minimum possible value */
  min?: number;
  /** Maximum possible value */
  max?: number;
  /** Step value for incrementing/decrementing */
  step?: number;
}

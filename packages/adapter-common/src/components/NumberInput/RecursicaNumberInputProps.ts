/**
 * Props for the Recursica NumberInput component.
 */
export interface RecursicaNumberInputProps {
  /** Enables/disables the controls to increment and decrement the value */
  hideControls?: boolean;
  /** Content rendered on the left side of the input (e.g. icon) */
  leftSection?: React.ReactNode;
  /** Content rendered on the right side of the input (e.g. percentage sign) */
  rightSection?: React.ReactNode;
  /** Minimum possible value */
  min?: number;
  /** Maximum possible value */
  max?: number;
  /** Step value for incrementing/decrementing */
  step?: number;
}

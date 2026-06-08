import React from "react";

/**
 * Props for the Recursica Chip component.
 */
export interface RecursicaChipProps {
  /** Enables the error state styling */
  error?: boolean;
  /** Leading icon content */
  icon?: React.ReactNode;
  /** Called when the remove (X) icon is clicked. If provided, the remove icon will be displayed. */
  onRemove?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  /** Screen reader label for the remove button. Defaults to 'Remove' */
  removeLabel?: string;
  /** Checked state for the chip (acts as a checkbox) */
  checked?: boolean;
}

import React from "react";

/**
 * Props for the Recursica Radio component.
 */
export interface RecursicaRadioProps {
  /** Visual label label string */
  label?: React.ReactNode;
  /** Auxiliary description helper text */
  description?: React.ReactNode;
  /** Error text description */
  error?: React.ReactNode;
}

/**
 * Props for the Recursica RadioGroup component.
 */
export interface RecursicaRadioGroupProps {
  /** Active value key in controlled mode */
  value?: unknown;
  /** Initial selected value in uncontrolled mode */
  defaultValue?: unknown;
  /**
   * Callback triggered when active value changes.
   * Single-argument by design (no event): matches Mantine's native RadioGroup
   * onChange, the cross-adapter source of truth. mui-adapter's RadioGroup
   * normalizes MUI's native two-argument (event, value) callback down to this.
   */
  onChange?: (value: string) => void;
}

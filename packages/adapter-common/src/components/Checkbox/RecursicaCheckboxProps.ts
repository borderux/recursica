import React from "react";

/**
 * Props for the Recursica Checkbox component.
 */
export interface RecursicaCheckboxProps {
  /** Visual label of the checkbox */
  label?: React.ReactNode;
  /** Auxiliary description helper text */
  description?: React.ReactNode;
  /** Error message or toggle */
  error?: React.ReactNode;
}

/**
 * Props for the Recursica CheckboxGroup component.
 */
export interface RecursicaCheckboxGroupProps {
  /** Selected values in controlled mode */
  value?: unknown[];
  /** Default selected values in uncontrolled mode */
  defaultValue?: unknown[];
  /** Callback triggered on selection change */
  onChange?: (value: unknown[]) => void;
  /** Toggle horizontal row display */
  row?: boolean;
}

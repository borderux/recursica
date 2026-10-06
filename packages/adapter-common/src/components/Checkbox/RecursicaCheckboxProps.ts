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
  // `onChange` is intentionally not declared here. Each adapter picks it up straight from its
  // underlying kit when that kit's native checkbox group already has an identical signature. Where a
  // kit has no native checkbox-group concept to match, the adapter declares this signature itself,
  // same as TransferList/Accordion.
}

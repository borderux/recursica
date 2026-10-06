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
  // `onChange` is intentionally not declared here. adapter-mantine-v8 picks it up straight from
  // Mantine's own native Checkbox.Group (identical signature already). adapter-mui-v7 has no
  // native checkbox-group concept to match — MUI's own `FormGroup` is layout-only, no value/
  // onChange — so it declares this signature itself, same as TransferList/Accordion.
}

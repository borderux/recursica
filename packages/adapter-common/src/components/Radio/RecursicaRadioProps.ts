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
  // `onChange` is intentionally not declared here. Each adapter picks it up straight from its
  // own underlying kit (Mantine's RadioGroup vs MUI's RadioGroup), signature and all, so a
  // Recursica component drops in over an existing implementation with no caller changes.
}

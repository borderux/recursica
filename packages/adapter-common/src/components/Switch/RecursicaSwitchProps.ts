import React from "react";

/**
 * Props for the Recursica Switch component.
 */
export interface RecursicaSwitchProps {
  /** Visual label next to track */
  label?: React.ReactNode;
  /** Description label below switch */
  description?: React.ReactNode;
  /** Error text label */
  error?: React.ReactNode;
}

/**
 * Props for the Recursica SwitchGroup component.
 */
export interface RecursicaSwitchGroupProps {
  /** Checked values list in controlled mode — each entry matches a child Switch's own `value` */
  value?: string[];
  /** Checked default values list in uncontrolled mode */
  defaultValue?: string[];
  // `onChange` is intentionally not declared here. mantine-adapter picks it up straight from
  // Mantine's own native Switch.Group (identical signature already). mui-adapter has no native
  // switch-group concept to match — MUI's own `FormGroup` is layout-only, no value/onChange —
  // so it declares this signature itself, same as TransferList/Accordion/CheckboxGroup.
}

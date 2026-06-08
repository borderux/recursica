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
  /** Checked values list in controlled mode */
  value?: unknown[];
  /** Checked default values list in uncontrolled mode */
  defaultValue?: unknown[];
  /** Callback triggered when any switch toggles state */
  onChange?: (value: unknown[]) => void;
}

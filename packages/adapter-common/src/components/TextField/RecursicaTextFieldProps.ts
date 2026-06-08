import React from "react";

/**
 * Props for the Recursica TextField component.
 */
export interface RecursicaTextFieldProps {
  /** Section rendered inside input on the left (e.g. icon) */
  leftSection?: React.ReactNode;
  /** Section rendered inside input on the right (e.g. clear button) */
  rightSection?: React.ReactNode;
}

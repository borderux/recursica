import React from "react";

/**
 * Props for the Recursica Autocomplete input component.
 */
export interface RecursicaAutocompleteProps {
  /** Data options to show in the dropdown */
  data?: unknown[];
  /** Error message or toggle state */
  error?: boolean | React.ReactNode;
  /** Marks input as required */
  required?: boolean;
  /** Renders asterisk beside label */
  withAsterisk?: boolean;
  /** Unique identifier */
  id?: string;
  /** Initial default value */
  defaultValue?: unknown;
  /** Left section decoration (e.g. icon) */
  leftSection?: React.ReactNode;
  /** Right section decoration (e.g. action button) */
  rightSection?: React.ReactNode;
  /** Placeholder text */
  placeholder?: string;
}

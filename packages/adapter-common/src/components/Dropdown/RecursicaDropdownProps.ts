import React from "react";

/**
 * Props for the Recursica Dropdown/Select component.
 */
export interface RecursicaDropdownProps {
  /** Internal hook for Selects to override raw layout width properties */
  containerWidth?: React.CSSProperties["width"];
  /** Data options array */
  data?: (
    | string
    | { value: string; label: React.ReactNode; disabled?: boolean }
  )[];
  /** Enable autocomplete search functionality */
  searchable?: boolean;
  /** Show input clear option button */
  clearable?: boolean;
  /** Marks field with visual asterisk */
  withAsterisk?: boolean;
  /** Placeholder text when value is empty */
  placeholder?: string;
}

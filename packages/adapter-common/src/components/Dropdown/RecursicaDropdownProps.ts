import React from "react";
import { type RecursicaComboboxData } from "../Combobox/RecursicaComboboxItem";

/**
 * Props for the Recursica Dropdown/Select component.
 */
export interface RecursicaDropdownProps {
  /** Internal hook for Selects to override raw layout width properties */
  containerWidth?: React.CSSProperties["width"];
  /** Data options array. `label` is matched against typed text and written into the input as the
   * selected display text — stays a real string (a whole subtree can't be matched/written),
   * unlike the `ReactNode` this was previously typed as. Falls back to `value` when omitted. */
  data?: RecursicaComboboxData;
  /** Enable autocomplete search functionality */
  searchable?: boolean;
  /** Show input clear option button */
  clearable?: boolean;
  /** Marks field with visual asterisk */
  withAsterisk?: boolean;
  /** Placeholder text when value is empty */
  placeholder?: string;
  /** Wrap `label`/`supportingText` onto additional lines instead of truncating with an ellipsis.
   * Defaults to `false` (single-line, truncated). */
  wrapItemText?: boolean;
  // `onChange` is intentionally not declared here. Each adapter picks it up straight from its
  // own underlying kit (Mantine's Select vs MUI's Select), signature and all, so a Recursica
  // component drops in over an existing implementation with no caller changes.
}

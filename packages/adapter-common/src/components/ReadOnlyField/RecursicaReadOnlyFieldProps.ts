import { ReadOnlyFieldType } from "./ReadOnlyField";

/**
 * Props for the Recursica ReadOnlyField component wrapper.
 */
export interface RecursicaReadOnlyFieldProps {
  /** The specific value to be rendered in read-only mode */
  value?: unknown;
  /** The data type formatting rules bounding how the string is presented */
  type?: ReadOnlyFieldType;
  /** Pass the native maximum width design variable dynamically bounding the specific wrapper width exclusively */
  controlMaxWidth?: string | undefined;
  /** Pass the native minimum width design variable dynamically bounding the specific wrapper width exclusively */
  controlMinWidth?: string | undefined;
}

/**
 * Props for the Recursica ReadOnlyTextField component.
 */
export interface RecursicaReadOnlyTextFieldProps {
  /** The value strictly rendered as text output */
  value?: unknown;
}

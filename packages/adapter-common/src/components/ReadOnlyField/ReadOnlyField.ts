/**
 * Defines the structured interpretation map determining how data is rendered visually when in Read-only mode natively.
 */
export type ReadOnlyFieldType = "text" | "number" | "date" | "boolean";

/**
 * Base properties required by any input control supporting native ReadOnly state injections globally.
 */
export interface ReadOnlyControlProps {
  /** Enables structural read-only mode dynamically mapping data boundaries instead of interactive elements. */
  readOnly?: boolean;
  /** Explicitly overrides the standard layout bindings injecting a custom React module natively instead of default text rendering. */
  readOnlyComponent?: React.ReactNode;
}

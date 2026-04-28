/**
 * Defines the structured interpretation map determining how data is rendered visually when in Read-only mode natively.
 */
export type ReadOnlyFieldType =
  | "text"
  | "number"
  | "date"
  | "boolean"
  | "switch";

/**
 * Base properties required by any input control supporting native ReadOnly state injections globally.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ReadOnlyControlProps<TProps = any> {
  /** Enables structural read-only mode dynamically mapping data boundaries instead of interactive elements. */
  readOnly?: boolean;
  /** Explicitly overrides the standard layout bindings injecting a custom React component natively instead of default text rendering. Receives full native props securely. */
  readOnlyComponent?: React.ElementType<TProps>;
  /** Custom renderer explicitly responsible for formatting missing/empty value mappings (overriding default 'N/A') */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  emptyValueComponent?: React.ElementType<{ value?: any }>;
}

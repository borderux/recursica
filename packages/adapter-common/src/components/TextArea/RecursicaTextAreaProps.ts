/**
 * Props for the Recursica TextArea component.
 */
export interface RecursicaTextAreaProps {
  /** Shows asterisk next to label */
  withAsterisk?: boolean;
  /** Max rows constraint for autosizing */
  maxRows?: number;
  /** Min rows constraint for autosizing */
  minRows?: number;
  /** Allow height to stretch automatically with content */
  autosize?: boolean;
}

/**
 * Props for the Recursica Panel component.
 */
export interface RecursicaPanelProps {
  /** Forces header text onto a single line truncating overflow with ellipsis */
  wrapHeaderText?: boolean;
  /** Direction or placement where the panel slides out from */
  placement?: "top" | "bottom" | "left" | "right";
  /** Control visibility state */
  opened?: boolean;
}

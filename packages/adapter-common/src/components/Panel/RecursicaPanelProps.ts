/**
 * Props for the Recursica Panel component.
 */
export interface RecursicaPanelProps {
  /** Forces header text onto a single line truncating overflow with ellipsis.  Default is true */
  wrapHeaderText?: boolean;
  /**
   * Direction the panel slides out from.
   * Named `placement`, not `position`: `position` is a global `BlockedStylingKeys` entry, so
   * it's typed `never` and stripped unless `overStyled: true`.
   */
  placement?: "top" | "bottom" | "left" | "right";
  /** Control visibility state */
  opened?: boolean;
}

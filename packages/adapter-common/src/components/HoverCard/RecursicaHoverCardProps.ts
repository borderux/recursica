import React from "react";

/**
 * Props for the Recursica HoverCard component.
 */
export interface RecursicaHoverCardProps {
  /** Draw directional arrow pointing to anchor element */
  withBeak?: boolean;
  /** Visual placement target orientation */
  position?:
    | "bottom"
    | "bottom-start"
    | "bottom-end"
    | "top"
    | "top-start"
    | "top-end"
    | "left"
    | "left-start"
    | "left-end"
    | "right"
    | "right-start"
    | "right-end";
  /** Delay before triggering open state in ms */
  openDelay?: number;
  /** Delay before triggering close state in ms */
  closeDelay?: number;
  /** Disable hover triggers */
  disabled?: boolean;
  /** Absolute offset spacing */
  offset?: number;
  /** Children target content */
  children?: React.ReactNode;
}

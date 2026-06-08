import React from "react";

/**
 * Props for the Recursica FormControlLayout component.
 */
export interface RecursicaFormControlLayoutProps {
  /** Layout structure direction */
  formLayout?: "stacked" | "side-by-side";
  /** Label sizing constraint */
  labelSize?: "small" | "default" | "md";
  /** Optional left section element (usually Label) */
  leftSection?: React.ReactNode;
  /** Main wrapper bounding maximum width */
  controlMaxWidth?: string;
  /** Main wrapper bounding minimum width */
  controlMinWidth?: string;
}

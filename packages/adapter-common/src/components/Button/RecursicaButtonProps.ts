import React from "react";

/**
 * Props for the Recursica Button component.
 */
export interface RecursicaButtonProps {
  /** The visual style variant of the button */
  variant?: "solid" | "outline" | "text";
  /** The size of the button */
  size?: "default" | "small";
  /** An optional icon element to display to the left of the button text */
  icon?: React.ReactNode;
  /** Which Recursica Loader variant to use when loading */
  loaderVariant?: "oval" | "bars" | "dots";
  /** The size variant for the loader */
  loaderSize?: "sm" | "md" | "lg" | "small" | "default" | "large";
  /** Whether to use the Recursica loader or fallback to default */
  useRecursicaLoader?: boolean;
}

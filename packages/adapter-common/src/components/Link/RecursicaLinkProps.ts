import React from "react";

/**
 * Props for the Recursica Link component.
 */
export interface RecursicaLinkProps {
  /** Leading icon shown next to text link */
  icon?: React.ReactNode;
  /** Text or target elements */
  children?: React.ReactNode;
  /** Polymorphic tag type override */
  component?: React.ElementType;
}

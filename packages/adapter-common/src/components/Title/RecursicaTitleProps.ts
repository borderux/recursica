import React from "react";

/**
 * Props for the Recursica Title component.
 */
export interface RecursicaTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Heading ordering hierarchies (1 represents H1, 6 represents H6) */
  order?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Title contents */
  children?: React.ReactNode;
  /** Polymorphic component override */
  component?: React.ElementType;
}

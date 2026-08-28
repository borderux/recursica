import React from "react";

/**
 * Props for the Recursica Heading component.
 */
export interface RecursicaHeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Heading ordering hierarchies (1 represents H1, 6 represents H6) */
  order?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Heading contents */
  children?: React.ReactNode;
  /** Polymorphic component override */
  component?: React.ElementType;
}

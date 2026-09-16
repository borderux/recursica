import React from "react";
import type { TextColor, TextEmphasis } from "../Text/RecursicaTextProps";

/**
 * Props for the Recursica Heading component.
 */
export interface RecursicaHeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Heading ordering hierarchies (1 represents H1, 6 represents H6) */
  order?: 1 | 2 | 3 | 4 | 5 | 6;
  /**
   * Semantic text color.
   * @default "default"
   */
  color?: TextColor;
  /**
   * Emphasis level of the text.
   * @default "high"
   */
  emphasis?: TextEmphasis;
  /** Heading contents */
  children?: React.ReactNode;
  /** Polymorphic component override */
  component?: React.ElementType;
}

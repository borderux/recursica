import React from "react";
import { type TextEmphasis, type TextState } from "../Text/RecursicaTextProps";

/**
 * Props for the Recursica Heading component.
 */
export interface RecursicaHeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Heading ordering hierarchies (1 represents H1, 6 represents H6) */
  order?: 1 | 2 | 3 | 4 | 5 | 6;
  /**
   * Text opacity level. Defaults to `high. `low` dims the heading
   * without changing its color. Only applies when no `state` is set — `state` wins.
   * @defaultValue "high"
   */
  emphasis?: TextEmphasis;
  /**
   * Semantic text color. Optional — when unset the heading inherits the surrounding
   * layer's text color. Takes precedence over `emphasis` (stateful text is full opacity).
   */
  state?: TextState;
  /** Heading contents */
  children?: React.ReactNode;
  /** Polymorphic component override */
  component?: React.ElementType;
}

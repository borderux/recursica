import React from "react";
import type { TextColor, TextEmphasis } from "../Text/RecursicaTextProps";

/**
 * Props for the Recursica Heading component.
 *
 * Forge mapping (names in `recursica_ui-kit.json` / `--recursica_ui-kit_components_<contract>_*`):
 * - Not a Forge component: intentionally outside the UI kit, so it has no `ui-kit_components_*` contract.
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

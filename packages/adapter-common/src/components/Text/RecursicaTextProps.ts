import React from "react";

/**
 * Typography style applied by `Text`: one of the built-in styles, or the name of any custom
 * style defined under `brand.typography` (rendered with its `recursica_brand_typography_<name>`
 * class). `string & {}` keeps editor autocomplete for the built-ins while accepting any name.
 */
export type TextVariant = "body" | "caption" | "overline" | (string & {});

/**
 * Supported semantic color options for text in Recursica.
 */
export type TextColor = "default" | "warning" | "alert" | "success";

/**
 * Supported emphasis levels for text in Recursica.
 */
export type TextEmphasis = "low" | "high";

/**
 * Props for the Recursica Text component.
 */
export interface RecursicaTextProps {
  /** Visual style variant layout */
  variant?: TextVariant;
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
  /** Children nodes */
  children?: React.ReactNode;
  /** Polymorphic component tag override */
  component?: React.ElementType;
}

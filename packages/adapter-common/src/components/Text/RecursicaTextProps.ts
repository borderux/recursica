import React from "react";

/**
 * Supported typographical layout variants in Recursica.
 */
export type TextVariant =
  | "body"
  | "body-small"
  | "caption"
  | "overline"
  | "subtitle"
  | "subtitle-small";

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

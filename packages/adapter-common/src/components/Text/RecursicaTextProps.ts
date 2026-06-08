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
 * Props for the Recursica Text component.
 */
export interface RecursicaTextProps {
  /** Visual style variant layout */
  variant?: TextVariant;
  /** Children nodes */
  children?: React.ReactNode;
  /** Polymorphic component tag override */
  component?: React.ElementType;
}

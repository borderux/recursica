import React from "react";
import { RecursicaSpacing } from "../../types";

/**
 * Props for the Recursica Flex layout component.
 */
export interface RecursicaFlexProps {
  /** Children nodes */
  children?: React.ReactNode;
  /** Global gap spacing key or CSS value */
  gap?: string | number | RecursicaSpacing;
  /** Horizontal row spacing */
  rowGap?: string | number | RecursicaSpacing;
  /** Vertical column spacing */
  columnGap?: string | number | RecursicaSpacing;
  /** Flex direction */
  direction?: React.CSSProperties["flexDirection"];
  /** Align items */
  align?: React.CSSProperties["alignItems"];
  /** Justify content */
  justify?: React.CSSProperties["justifyContent"];
  /** Flex wrap */
  wrap?: React.CSSProperties["flexWrap"];
}

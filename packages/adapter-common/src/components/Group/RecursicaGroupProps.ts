import React from "react";
import { RecursicaSpacing } from "../../types";

/**
 * Props for the Recursica Group layout component.
 */
export interface RecursicaGroupProps {
  /** Children elements to align horizontally */
  children?: React.ReactNode;
  /** Gap spacing */
  gap?: string | number | RecursicaSpacing;
  /** Row gap spacing */
  rowGap?: string | number | RecursicaSpacing;
  /** Column gap spacing */
  columnGap?: string | number | RecursicaSpacing;
  /** Align items justify properties */
  justify?: React.CSSProperties["justifyContent"];
  /** Align items vertical alignment */
  align?: React.CSSProperties["alignItems"];
  /** Flex-wrap settings */
  wrap?: React.CSSProperties["flexWrap"];
}

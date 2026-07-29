import React from "react";
import { RecursicaSpacing } from "../../types";

/**
 * Props for the Recursica Grid layout component.
 */
export interface RecursicaGridProps {
  /** Grid columns and their content */
  children?: React.ReactNode;
  /** Gap between columns. Renamed from Mantine's `gutter` for consistency with Flex/Stack/Group. */
  gap?: string | number | RecursicaSpacing;
  /** Number of columns in each row */
  columns?: number;
  /** If set, columns in the last row expand to fill all available space */
  grow?: boolean;
  /** Justify-content flexbox property */
  justify?: React.CSSProperties["justifyContent"];
  /** Align-items flexbox property */
  align?: React.CSSProperties["alignItems"];
}

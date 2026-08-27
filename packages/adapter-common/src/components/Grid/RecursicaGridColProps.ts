import React from "react";
import { RecursicaBreakpoint } from "../../types";

/** @deprecated Use the shared {@link RecursicaBreakpoint} instead. */
type RecursicaGridBreakpoint = RecursicaBreakpoint;

/**
 * Props for the Recursica Grid.Col layout component.
 */
export interface RecursicaGridColProps {
  /** Content of the column */
  children?: React.ReactNode;
  /** Column span, either a fixed value or a per-breakpoint object */
  span?:
    | number
    | "auto"
    | "content"
    | Partial<Record<RecursicaGridBreakpoint, number | "auto" | "content">>;
  /** Column offset, either a fixed value or a per-breakpoint object */
  offset?: number | Partial<Record<RecursicaGridBreakpoint, number>>;
  /** Column order, either a fixed value or a per-breakpoint object */
  order?: number | Partial<Record<RecursicaGridBreakpoint, number>>;
  /** Hides the column below the given breakpoint */
  visibleFrom?: RecursicaGridBreakpoint;
  /** Hides the column above the given breakpoint */
  hiddenFrom?: RecursicaGridBreakpoint;
}

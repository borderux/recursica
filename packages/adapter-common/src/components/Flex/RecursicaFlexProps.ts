import React from "react";
import { Responsive, RecursicaSpacing } from "../../types";

/**
 * Props for the Recursica Flex layout component.
 *
 * Every layout prop accepts either a single value or a per-breakpoint {@link Responsive} object
 * (e.g. `direction={{ base: "column", xl: "row" }}`). `rec-*` spacing tokens are resolved inside
 * responsive objects too (e.g. `gap={{ base: "rec-sm", xl: "rec-lg" }}`).
 */
export interface RecursicaFlexProps {
  /** Children nodes */
  children?: React.ReactNode;
  /** Global gap spacing key or CSS value */
  gap?: Responsive<string | number | RecursicaSpacing>;
  /** Horizontal row spacing */
  rowGap?: Responsive<string | number | RecursicaSpacing>;
  /** Vertical column spacing */
  columnGap?: Responsive<string | number | RecursicaSpacing>;
  /** Flex direction */
  direction?: Responsive<React.CSSProperties["flexDirection"]>;
  /** Align items */
  align?: Responsive<React.CSSProperties["alignItems"]>;
  /** Justify content */
  justify?: Responsive<React.CSSProperties["justifyContent"]>;
  /** Flex wrap */
  wrap?: Responsive<React.CSSProperties["flexWrap"]>;
}

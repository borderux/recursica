import React from "react";
import { RecursicaSpacing } from "../../types";

/**
 * Props for the Recursica Stack layout component.
 */
export interface RecursicaStackProps {
  /** Children elements aligned vertically */
  children?: React.ReactNode;
  /** Gap space size */
  gap?: string | number | RecursicaSpacing;
  /** Align-items flexbox property */
  align?: React.CSSProperties["alignItems"];
  /** Justify-content flexbox property */
  justify?: React.CSSProperties["justifyContent"];
}

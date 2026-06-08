import React from "react";
import { RecursicaSpacing } from "../../types";

/**
 * Props for the Recursica Container layout component.
 */
export interface RecursicaContainerProps {
  /** Content inside the container */
  children?: React.ReactNode;
  /** Maximum width constraint */
  size?:
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | RecursicaSpacing
    | (string & {})
    | number;
}

import { RecursicaSize } from "../../types";

/**
 * Props for the Recursica Loader spinner component.
 */
export interface RecursicaLoaderProps {
  /** Map to the component styles defined in variables */
  variant?: "oval" | "bars" | "dots";
  /** Map to Recursica sizes */
  size?: "sm" | "md" | "lg" | RecursicaSize;
}

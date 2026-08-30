import { RecursicaSize } from "../../types";

/**
 * Props for the Recursica Loader spinner component.
 */
export interface RecursicaLoaderProps {
  /** Map to the component styles defined in variables */
  variant?: "oval" | "bars" | "dots";
  /** Map to Recursica sizes */
  size?: "sm" | "md" | "lg" | RecursicaSize;
  /** Freezes the loader's CSS animation when `false` — the loader still
   * renders its normal shape, just without motion. Defaults to `true` (the
   * normal, animated loader). Use `false` for a deterministic rendering,
   * e.g. a visual-regression snapshot, where a moving animation would
   * otherwise diff differently every run. */
  animate?: boolean;
}

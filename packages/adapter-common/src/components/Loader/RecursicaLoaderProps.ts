import { RecursicaSize } from "../../types";

/**
 * Props for the Recursica Loader spinner component.
 *
 * Forge mapping (names in `recursica_ui-kit.json` / `--recursica_ui-kit_components_<contract>_*`):
 * - Contract `loader`. Axis `sizes` (small, default, large) ← `size`.
 * - `variant` (oval, bars, dots) is not a Forge axis; it is a non-themed option kept by Recursica.
 */
export interface RecursicaLoaderProps {
  /**
   * Map to the component styles defined in variables
   *
   * Not a Forge axis (Forge's `loader` has only `sizes`).
   */
  variant?: "oval" | "bars" | "dots" | (string & {});
  /**
   * Map to Recursica sizes
   *
   * Forge axis `sizes` (small, default, large).
   */
  size?: "sm" | "md" | "lg" | RecursicaSize;
  /** Freezes the loader's CSS animation when `false` — the loader still
   * renders its normal shape, just without motion. Defaults to `true` (the
   * normal, animated loader). Use `false` for a deterministic rendering,
   * e.g. a visual-regression snapshot, where a moving animation would
   * otherwise diff differently every run. */
  animate?: boolean;
}

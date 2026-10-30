import React from "react";

/**
 * Props for the Recursica Button component.
 *
 * Forge mapping (names in `recursica_ui-kit.json` / `--recursica_ui-kit_components_<contract>_*`):
 * - Contract `button`. Axes: `styles` ← `variant` (solid, text, outline); `sizes` ← `size` (default, small); `content` (icon-label, label, icon-only) is derived from `icon` and children, not a prop; `states` disabled ← `disabled`.
 * - `loaderVariant`, `loaderSize` and `useRecursicaLoader` configure the embedded Loader and are not Forge axes.
 */
export interface RecursicaButtonProps {
  /**
   * The visual style variant of the button
   *
   * Forge axis `styles` (solid, text, outline).
   */
  variant?: "solid" | "outline" | "text" | (string & {});
  /**
   * The size of the button
   *
   * Forge axis `sizes` (default, small).
   */
  size?: "default" | "small";
  /**
   * An optional icon element to display to the left of the button text
   *
   * Together with the children this selects Forge's derived `content` axis (icon-label, label, icon-only).
   */
  icon?: React.ReactNode;
  /** Which Recursica Loader variant to use when loading */
  loaderVariant?: "oval" | "bars" | "dots";
  /** The size variant for the loader */
  loaderSize?: "sm" | "md" | "lg" | "small" | "default" | "large";
  /** Whether to use the Recursica loader or fallback to default */
  useRecursicaLoader?: boolean;
}

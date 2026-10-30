import React from "react";

/**
 * Props for the Recursica Avatar component.
 *
 * Forge mapping (names in `recursica_ui-kit.json` / `--recursica_ui-kit_components_<contract>_*`):
 * - Contract `avatar`. Names differ from the usual convention: Forge `types` (solid, outline, ghost) ← `variant`; Forge `styles` (text, icon, image) is derived from `src`, `icon` and children, not a prop; `sizes` ← `size`.
 */
export interface RecursicaAvatarProps {
  /** Initials or other text fallback, shown when neither `src` nor `icon` is set */
  children?: React.ReactNode;
  /**
   * Size of the avatar
   *
   * Forge axis `sizes` (small, default, large).
   */
  size?: "small" | "default" | "large";
  /**
   * Visual variant style
   *
   * Forge axis `types` (solid, outline, ghost). Not Forge's `styles`.
   */
  variant?: "solid" | "outline" | "ghost";
  /** Icon element fallback when initials or src aren't shown */
  icon?: React.ReactNode;
}

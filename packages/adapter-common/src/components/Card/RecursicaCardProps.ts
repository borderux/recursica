import React from "react";

/**
 * Props for the Recursica Card component.
 *
 * Forge mapping (names in `recursica_ui-kit.json` / `--recursica_ui-kit_components_<contract>_*`):
 * - Contract `card` (no variants).
 */
export interface RecursicaCardProps {
  /** The content nodes rendered inside the card container */
  children?: React.ReactNode;
}

/**
 * Props for the Recursica Card Section sub-component.
 */
export interface RecursicaCardSectionProps {
  /** Content of the card section */
  children?: React.ReactNode;
}

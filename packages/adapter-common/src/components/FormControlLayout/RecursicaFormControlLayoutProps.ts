import React from "react";

/**
 * Props for the Recursica FormControlLayout component.
 *
 * Forge mapping (names in `recursica_ui-kit.json` / `--recursica_ui-kit_components_<contract>_*`):
 * - Shared by every form-control contract (`text-field`, `textarea`, `date-picker`, `time-picker`, `number-input`, `file-input`, `file-upload`, `dropdown`, `autocomplete`, `slider`, `transfer-list`, `read-only-field`, `label`, and the group contracts) and is the Recursica name for Forge's axes `layouts` and (for Label) `sizes`.
 */
export interface RecursicaFormControlLayoutProps {
  /**
   * Layout structure direction
   *
   * Forge axis `layouts` (stacked, side-by-side).
   */
  formLayout?: "stacked" | "side-by-side";
  /**
   * Label sizing constraint. Only `small`/`default` are defined by Recursica's Label tokens — `md` was never a real design size and has been removed.
   *
   * Forge Label axis `sizes` (default, small).
   */
  labelSize?: "small" | "default";
  /** Optional left section element (usually Label) */
  leftSection?: React.ReactNode;
  /** Main wrapper bounding maximum width */
  controlMaxWidth?: string;
  /** Main wrapper bounding minimum width */
  controlMinWidth?: string;
}

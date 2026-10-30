import React from "react";

/**
 * Props for the Recursica TextField component.
 *
 * Forge mapping (names in `recursica_ui-kit.json` / `--recursica_ui-kit_components_<contract>_*`):
 * - Contract `text-field`. Axes: `layouts` (stacked, side-by-side) ← `formLayout`; `states` error ← `error`, disabled ← `disabled`.
 */
export interface RecursicaTextFieldProps {
  /**
   * Section rendered inside input on the left (e.g. icon).
   * Not renamed to Forge's `leadingIcon`: deliberately reuses a common UI-kit name;
   * the alternative (`startAdornment`) is more implementation-specific and isn't icon-only either.
   */
  leftSection?: React.ReactNode;
  /** Section rendered inside input on the right (e.g. clear button). Same naming rationale as `leftSection` above. */
  rightSection?: React.ReactNode;
}

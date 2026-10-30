import React from "react";

/**
 * Props for the Recursica Radio component.
 *
 * Forge mapping (names in `recursica_ui-kit.json` / `--recursica_ui-kit_components_<contract>_*`):
 * - Contract `radio-button`: Forge's name for this component is `radio-button`; Recursica keeps `Radio`. Axes: `selection-states` (selected, unselected) is derived from the control's checked state, not a prop; `states` disabled ← `disabled`.
 * - Forge's `radio-button-item` contract is this Radio when rendered inside a RadioGroup (the item is a child of the group).
 */
export interface RecursicaRadioProps {
  /** Visual label label string */
  label?: React.ReactNode;
  /** Auxiliary description helper text */
  description?: React.ReactNode;
  /** Error text description */
  error?: React.ReactNode;
}

/**
 * Props for the Recursica RadioGroup component.
 *
 * Forge mapping (names in `recursica_ui-kit.json` / `--recursica_ui-kit_components_<contract>_*`):
 * - Contract `radio-button-group` (Recursica: RadioGroup). Axis `layouts` (stacked, side-by-side) ← `formLayout`. Each Radio child maps to Forge's `radio-button-item`.
 */
export interface RecursicaRadioGroupProps {
  /** Active value key in controlled mode */
  value?: unknown;
  /** Initial selected value in uncontrolled mode */
  defaultValue?: unknown;
  // `onChange` is intentionally not declared here. Each adapter picks it up straight from its
  // own underlying kit, signature and all, so a Recursica component drops in over an existing
  // implementation with no caller changes.
}

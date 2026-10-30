import React from "react";

/**
 * Props for the Recursica Switch component.
 *
 * Forge mapping (names in `recursica_ui-kit.json` / `--recursica_ui-kit_components_<contract>_*`):
 * - Contract `switch`. Axes: `selection-states` (selected, unselected) is derived from the checked state, not a prop; `states` disabled ← `disabled`.
 * - Forge's `switch-item` contract is this Switch when rendered inside a SwitchGroup (the item is a child of the group).
 */
export interface RecursicaSwitchProps {
  /** Visual label next to track */
  label?: React.ReactNode;
  /** Description label below switch */
  description?: React.ReactNode;
  /** Error text label */
  error?: React.ReactNode;
}

/**
 * Props for the Recursica SwitchGroup component.
 *
 * Forge mapping (names in `recursica_ui-kit.json` / `--recursica_ui-kit_components_<contract>_*`):
 * - Contract `switch-group`. Axis `layouts` (stacked, side-by-side) ← `formLayout`. Each Switch child maps to Forge's `switch-item`.
 */
export interface RecursicaSwitchGroupProps {
  /** Checked values list in controlled mode — each entry matches a child Switch's own `value` */
  value?: string[];
  /** Checked default values list in uncontrolled mode */
  defaultValue?: string[];
  // `onChange` is intentionally not declared here. Each adapter picks it up straight from its
  // underlying kit when that kit's native switch group already has an identical signature. Where a
  // kit has no native switch-group concept to match, the adapter declares this signature itself,
  // same as TransferList/Accordion/CheckboxGroup.
}

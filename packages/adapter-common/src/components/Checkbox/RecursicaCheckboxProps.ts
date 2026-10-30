import React from "react";

/**
 * Props for the Recursica Checkbox component.
 *
 * Forge mapping (names in `recursica_ui-kit.json` / `--recursica_ui-kit_components_<contract>_*`):
 * - Contract `checkbox`. Axes: `selection-states` (checked, unchecked, indeterminate) is derived from the control's checked/indeterminate state, not a prop; `states` disabled ← `disabled`.
 * - Forge's `checkbox-item` contract is this Checkbox when it is rendered inside a CheckboxGroup (Mantine-style grouped structure: the item is a child of the group, not a separate component).
 */
export interface RecursicaCheckboxProps {
  /** Visual label of the checkbox */
  label?: React.ReactNode;
  /** Auxiliary description helper text */
  description?: React.ReactNode;
  /** Error message or toggle */
  error?: React.ReactNode;
}

/**
 * Props for the Recursica CheckboxGroup component.
 *
 * Forge mapping (names in `recursica_ui-kit.json` / `--recursica_ui-kit_components_<contract>_*`):
 * - Contract `checkbox-group`. Axis `layouts` (stacked, side-by-side) ← `formLayout` (see `RecursicaFormControlLayoutProps`). Each Checkbox child maps to Forge's `checkbox-item`.
 */
export interface RecursicaCheckboxGroupProps {
  /** Selected values in controlled mode */
  value?: unknown[];
  /** Default selected values in uncontrolled mode */
  defaultValue?: unknown[];
  // `onChange` is intentionally not declared here. Each adapter picks it up straight from its
  // underlying kit when that kit's native checkbox group already has an identical signature. Where a
  // kit has no native checkbox-group concept to match, the adapter declares this signature itself,
  // same as TransferList/Accordion.
}

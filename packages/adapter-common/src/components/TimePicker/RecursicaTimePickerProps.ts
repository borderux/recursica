import React from "react";

/**
 * Props for the Recursica TimePicker component.
 *
 * Forge mapping (names in `recursica_ui-kit.json` / `--recursica_ui-kit_components_<contract>_*`):
 * - Contract `time-picker`. Axes: `layouts` (stacked, side-by-side) ← `formLayout`; `states` error ← `error`, disabled ← `disabled`.
 */
export interface RecursicaTimePickerProps {
  /** Whether the seconds segment should be shown and editable. Defaults to `false`. */
  withSeconds?: boolean;
  /** Minimum possible time string. Format is `HH:mm` normally, or `HH:mm:ss` when `withSeconds` is true. */
  minTime?: string;
  /** Maximum possible time string. Format is `HH:mm` normally, or `HH:mm:ss` when `withSeconds` is true. */
  maxTime?: string;
  /** Section rendered inside the time field on the left (e.g. icon). Naming rationale: see `RecursicaTextFieldProps.leftSection`. */
  leftSection?: React.ReactNode;
}

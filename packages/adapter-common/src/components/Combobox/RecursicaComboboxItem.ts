import React from "react";

/**
 * A single item in Autocomplete/Dropdown's `data`. Shared between both components — and both
 * adapters, via this package — since their item vocabulary is identical (see
 * MANTINE_ADAPTER_RICH_OPTION_DATA.md at the repo root).
 */
export interface RecursicaComboboxItem {
  value: string;
  /** Displayed/matched text; falls back to `value` when omitted. */
  label?: string;
  disabled?: boolean;
  /** Rendered before the label inside the option row. */
  leadingIcon?: React.ReactNode;
  /** Rendered as a secondary line under the label inside the option row. */
  supportingText?: string;
}

/** `data` accepted by Autocomplete/Dropdown: a plain string, or a `RecursicaComboboxItem`. */
export type RecursicaComboboxData = (string | RecursicaComboboxItem)[];

/** Same shape as `RecursicaComboboxItem`, but with `label` guaranteed present — the result of
 * `normalizeComboboxData` (see `../../utils/normalizeComboboxData`). */
export interface RecursicaComboboxItemWithLabel extends RecursicaComboboxItem {
  label: string;
}

import React from "react";
import {
  type ComboboxStringItem,
  type ComboboxLikeRenderOptionInput,
} from "@mantine/core";

// `ComboboxStringItem`/`ComboboxItem` only type `value`/`label`/`disabled` —
// `leadingIcon`/`supportingText` are extra fields Mantine's own `getParsedComboboxData` passes
// through untouched whenever an item already has both `value` and `label` (see
// get-parsed-combobox-data.mjs), so they reach `option` here at runtime even though the upstream
// type doesn't know about them. Generic over both Autocomplete's `ComboboxStringItem` (optional
// `label`) and Dropdown's `ComboboxItem` (required `label`) — the same renderer serves both.
type RichComboboxItem = ComboboxStringItem & {
  label?: string;
  leadingIcon?: React.ReactNode;
  supportingText?: string;
};

export interface RichOptionClassNames {
  optionContent: string;
  optionIcon: string;
  optionText: string;
  /** Combined with `optionText` when `wrapItemText` is true — see `renderRichOption` below. */
  optionTextWrap: string;
  optionSupportingText: string;
}

/**
 * `renderOption` for Autocomplete/Dropdown that renders an item's `leadingIcon`/`supportingText`
 * (see MANTINE_ADAPTER_RICH_OPTION_DATA.md) inside the option row. Falls back to plain
 * `option.label` — the same rendering Mantine uses when no `renderOption` is supplied at all — so
 * items without the new fields are unaffected.
 *
 * `wrapItemText` (default `false`) controls whether `label`/`supportingText` wrap onto additional
 * lines or truncate to a single line with an ellipsis.
 */
export function renderRichOption<T extends ComboboxStringItem>(
  { option }: ComboboxLikeRenderOptionInput<T>,
  classNames: RichOptionClassNames,
  wrapItemText = false,
): React.ReactNode {
  const { label, leadingIcon, supportingText } = option as RichComboboxItem;
  const displayLabel = label ?? option.value;
  if (!leadingIcon && !supportingText) {
    return displayLabel;
  }
  const optionTextClassName = wrapItemText
    ? `${classNames.optionText} ${classNames.optionTextWrap}`
    : classNames.optionText;
  return (
    <span className={classNames.optionContent}>
      {leadingIcon && (
        <span className={classNames.optionIcon}>{leadingIcon}</span>
      )}
      <span className={optionTextClassName}>
        <span>{displayLabel}</span>
        {supportingText && (
          <span className={classNames.optionSupportingText}>
            {supportingText}
          </span>
        )}
      </span>
    </span>
  );
}

import React from "react";
import { type RecursicaComboboxItemWithLabel } from "@recursica/adapter-common";

export interface RichOptionClassNames {
  optionContent: string;
  optionIcon: string;
  optionText: string;
  /** Combined with `optionText` when `wrapItemText` is true — see `renderRichOptionContent` below. */
  optionTextWrap: string;
  optionSupportingText: string;
}

/**
 * `MenuItem`/option children for Dropdown/Autocomplete that renders `leadingIcon`/`supportingText`
 * (see MANTINE_ADAPTER_RICH_OPTION_DATA.md) inside the row. Falls back to plain `label` when
 * neither is present, so items without the new fields render exactly as before.
 *
 * `wrapItemText` (default `false`) controls whether `label`/`supportingText` wrap onto additional
 * lines or truncate to a single line with an ellipsis.
 */
export function renderRichOptionContent(
  item: Pick<
    RecursicaComboboxItemWithLabel,
    "label" | "leadingIcon" | "supportingText"
  >,
  classNames: RichOptionClassNames,
  wrapItemText = false,
): React.ReactNode {
  const { label, leadingIcon, supportingText } = item;
  if (!leadingIcon && !supportingText) {
    return label;
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
        <span>{label}</span>
        {supportingText && (
          <span className={classNames.optionSupportingText}>
            {supportingText}
          </span>
        )}
      </span>
    </span>
  );
}

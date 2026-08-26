import React, { forwardRef } from "react";
import {
  Autocomplete as MantineAutocomplete,
  type AutocompleteProps as MantineAutocompleteProps,
  type InputWrapperProps,
} from "@mantine/core";
import {
  type ReadOnlyControlProps,
  normalizeComboboxData,
} from "@recursica/adapter-common";
import {
  filterStylingProps,
  omitUnsupportedProps,
  mergeClassNames,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import { type RecursicaFormControlWrapperProps } from "../FormControlWrapper/FormControlWrapper";
import { WithReadOnlyWrapper } from "../ReadOnlyField/WithReadOnlyWrapper";
import { renderRichOption } from "../../utils/renderRichOption";
import styles from "./AutoComplete.module.css";

import { type RecursicaAutocompleteProps as BaseRecursicaAutocompleteProps } from "@recursica/adapter-common";

export interface RecursicaAutoCompleteProps
  extends Omit<
      MantineAutocompleteProps,
      | "size"
      | "variant"
      | "radius"
      | "wrapperProps"
      | "data"
      | "defaultValue"
      | "value"
    >,
    Pick<
      InputWrapperProps,
      "label" | "error" | "required" | "withAsterisk" | "id"
    >,
    Omit<
      RecursicaFormControlWrapperProps,
      "controlMaxWidth" | "controlMinWidth"
    >,
    ReadOnlyControlProps,
    BaseRecursicaAutocompleteProps {
  /** Current input value */
  value?: string;
}

export type AutoCompleteProps = RecursicaOverStyled<RecursicaAutoCompleteProps>;

// Props this component intentionally doesn't support — deleted at runtime so they can't leak
// through even if a caller forces them via plain JavaScript, bypassing the `Omit<>` above.
const UNSUPPORTED_PROPS = [
  "size", // Recursica controls sizing via the `size` variant + design tokens, not raw dimensions.
  "variant", // Colors/variants are token-driven; the library's native palette isn't exposed.
  "radius", // Recursica does not expose the library's native corner-radius system.
] as const satisfies readonly (keyof MantineAutocompleteProps)[];

export const AutoComplete = forwardRef<HTMLInputElement, AutoCompleteProps>(
  function AutoComplete(props, ref) {
    const {
      overStyled = false,
      formLayout = "stacked",

      // Label & Wrapper Maps
      labelSize,
      labelAlignment,
      labelOptionalText,
      labelWithEditIcon,
      onLabelEditClick,

      label,
      assistiveText,
      assistiveWithIcon,
      error,
      required,
      withAsterisk,
      id,
      className,
      style,
      disabled,
      readOnly,
      readOnlyComponent,
      emptyValueComponent,
      value,
      defaultValue,
      data,
      renderOption,
      wrapItemText = false,
      ...rest
    } = props;

    const sanitizedProps = omitUnsupportedProps(
      filterStylingProps(rest, overStyled) as Record<string, unknown>,
      UNSUPPORTED_PROPS,
    );
    const restRecord = sanitizedProps as Record<string, unknown>;

    // Mantine's own data parser only preserves extra fields (`leadingIcon`/`supportingText`) when
    // an item already has both `value` and `label` — an item with `value` only is rebuilt into a
    // bare `{value, label: value, disabled}` object, silently dropping them (see
    // get-parsed-combobox-data.mjs). `normalizeComboboxData` backfills `label` so the rich fields
    // always survive regardless of whether the caller set it.
    const normalizedData = normalizeComboboxData(data);

    // Securely map core native blocks down ensuring nested CSS modules map precisely
    const mergedClassNames = mergeClassNames(
      {
        wrapper: styles.root, // The nested Input internal relative wrapper bounding box
        input: styles.input,
        section: styles.section,
        dropdown: styles.dropdown,
        option: styles.option,
      },
      restRecord.classNames as Partial<Record<string, string>> | undefined,
    );

    const optionClassNames = {
      optionContent: styles.optionContent,
      optionIcon: styles.optionIcon,
      optionText: styles.optionText,
      optionTextWrap: styles.optionTextWrap,
      optionSupportingText: styles.optionSupportingText,
    };

    const wrapperClass = className
      ? `${styles.layoutOverride} ${className}`
      : styles.layoutOverride;

    return (
      <WithReadOnlyWrapper
        className={wrapperClass}
        style={style as React.CSSProperties}
        controlMaxWidth="var(--autocomplete-control-max-width)"
        controlMinWidth="var(--autocomplete-control-min-width)"
        overStyled={overStyled as true}
        formLayout={formLayout}
        labelSize={labelSize}
        labelAlignment={labelAlignment}
        labelOptionalText={labelOptionalText}
        labelWithEditIcon={labelWithEditIcon}
        onLabelEditClick={onLabelEditClick}
        label={label}
        assistiveText={assistiveText}
        assistiveWithIcon={assistiveWithIcon}
        error={error}
        required={required}
        withAsterisk={withAsterisk}
        id={id}
        readOnly={readOnly}
        readOnlyComponent={readOnlyComponent}
        emptyValueComponent={emptyValueComponent}
        readOnlyType="text"
        readOnlyValue={value !== undefined ? value : defaultValue}
        readOnlyNativeProps={props}
        activeComponent={
          /* Naked Input execution safely decoupled from Mantine's macro Input.Wrapper DOM hooks */
          <MantineAutocomplete
            ref={ref}
            {...(sanitizedProps as unknown as MantineAutocompleteProps)}
            classNames={mergedClassNames}
            disabled={disabled}
            value={value as string | undefined}
            defaultValue={defaultValue as string | undefined}
            error={!!error}
            data={normalizedData as unknown as MantineAutocompleteProps["data"]}
            renderOption={
              renderOption ??
              ((input) =>
                renderRichOption(input, optionClassNames, wrapItemText))
            }
          />
        }
      />
    );
  },
);

AutoComplete.displayName = "AutoComplete";

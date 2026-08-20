import React, { forwardRef } from "react";
import {
  Autocomplete as MuiAutocomplete,
  type AutocompleteProps as MuiAutocompleteProps,
  TextField as MuiTextField,
  // removed InputWrapperProps
} from "@mui/material";
import { type ReadOnlyControlProps } from "@recursica/adapter-common";
import {
  filterStylingProps,
  omitUnsupportedProps,
  mergeClassNames,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import { type RecursicaFormControlWrapperProps } from "../FormControlWrapper/FormControlWrapper";
import { WithReadOnlyWrapper } from "../ReadOnlyField/WithReadOnlyWrapper";
import styles from "./Autocomplete.module.css";

import { type RecursicaAutocompleteProps as BaseRecursicaAutocompleteProps } from "@recursica/adapter-common";

export interface RecursicaAutocompleteProps
  extends Omit<
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      MuiAutocompleteProps<any, any, any, any, "div">,
      | "variant"
      | "size"
      | "wrapperProps"
      | "radius"
      | "renderInput"
      | "classes"
      | "defaultValue"
    >,
    Omit<
      RecursicaFormControlWrapperProps,
      | "controlMaxWidth"
      | "controlMinWidth"
      | "error"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      | keyof MuiAutocompleteProps<any, any, any, any, "div">
    >,
    ReadOnlyControlProps,
    BaseRecursicaAutocompleteProps {}

export type AutocompleteProps = RecursicaOverStyled<RecursicaAutocompleteProps>;

export const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(
  function Autocomplete(props, ref) {
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      leftSection,
      rightSection,
      placeholder,
      ListboxProps,
      ...rest
    } = props;
    // Props this component intentionally doesn't support — deleted at runtime so they can't leak
    // through even if a caller forces them via plain JavaScript, bypassing the Omit<> above.
    const UNSUPPORTED_PROPS = [
      "size", // Recursica controls sizing via design tokens, not MUI's native small/medium size
    ] as const satisfies readonly (keyof MuiAutocompleteProps<
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any,
      "div"
    >)[];

    const sanitizedProps = omitUnsupportedProps(
      filterStylingProps(rest, overStyled),
      UNSUPPORTED_PROPS,
    );
    const restRecord = sanitizedProps as Record<string, unknown>;

    // Securely map core native blocks down ensuring nested CSS modules map precisely. Note MUI's
    // actual prop is "classes", not "classNames" (that's Mantine's naming) — this used to read
    // the wrong key, silently no-op-ing any caller-supplied classes. The caller-facing slot names
    // below (wrapper/input/dropdown/option) mirror the mantine-adapter's own Autocomplete
    // classNames slots, translated to MUI's real classes slot names (root/inputRoot/listbox/option).
    const callerClasses = restRecord.classes as
      | Partial<Record<string, string>>
      | undefined;
    const mergedClassNames = mergeClassNames(
      {
        root: styles.root,
        inputRoot: styles.input, // Map Mantine .input (wrapper) to MUI's inputRoot
        listbox: styles.dropdown, // Map Mantine .dropdown to MUI's listbox
        option: styles.option,
      },
      callerClasses && {
        root: callerClasses.wrapper,
        inputRoot: callerClasses.input,
        listbox: callerClasses.dropdown,
        option: callerClasses.option,
      },
    );

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
        id={id}
        disabled={disabled}
        readOnly={readOnly}
        readOnlyComponent={readOnlyComponent}
        emptyValueComponent={emptyValueComponent}
        readOnlyType="text"
        readOnlyValue={value !== undefined ? value : defaultValue}
        readOnlyNativeProps={props}
        activeComponent={
          /* Naked Input execution safely decoupled from Mui's macro Input.Wrapper DOM hooks */
          <MuiAutocomplete
            ref={ref}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            {...(sanitizedProps as any)}
            freeSolo
            disableClearable
            classes={mergedClassNames}
            disabled={disabled}
            value={value}
            defaultValue={defaultValue}
            forcePopupIcon={false}
            data-error={error ? "true" : undefined}
            data-disabled={disabled ? "true" : undefined}
            data-with-left-section={leftSection ? "true" : undefined}
            data-with-right-section={rightSection ? "true" : undefined}
            ListboxProps={{
              ...ListboxProps,
              className: mergedClassNames.listbox,
            }}
            options={data || []}
            renderInput={(params) => {
              const { InputProps, ...restParams } = params;
              return (
                <MuiTextField
                  {...restParams}
                  placeholder={placeholder}
                  variant="standard"
                  InputProps={{
                    ...InputProps,
                    startAdornment: leftSection ? (
                      <span className={styles.section} data-position="left">
                        {leftSection}
                      </span>
                    ) : (
                      InputProps.startAdornment
                    ),
                    endAdornment: rightSection ? (
                      <span className={styles.section} data-position="right">
                        {rightSection}
                      </span>
                    ) : (
                      InputProps.endAdornment
                    ),
                  }}
                />
              );
            }}
          />
        }
      />
    );
  },
);

Autocomplete.displayName = "Autocomplete";

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
    const sanitizedProps = filterStylingProps(rest, overStyled);
    const restRecord = sanitizedProps as Record<string, unknown>;

    // Delete prohibited sizing hooks from bypassing variables natively
    delete restRecord["size"];
    delete restRecord["variant"];
    delete restRecord["radius"];

    // Securely map core native blocks down ensuring nested CSS modules map precisely
    const mergedClassNames: Partial<Record<string, string>> = {
      root: styles.root,
      inputRoot: styles.input, // Map Mantine .input (wrapper) to MUI's inputRoot
      listbox: styles.dropdown, // Map Mantine .dropdown to MUI's listbox
      option: styles.option,
    };

    const classNamesProp = restRecord.classNames;
    if (
      classNamesProp &&
      typeof classNamesProp === "object" &&
      !Array.isArray(classNamesProp)
    ) {
      const o = classNamesProp as Partial<Record<string, string>>;
      mergedClassNames.root = o.wrapper
        ? `${styles.root} ${o.wrapper}`
        : styles.root;
      mergedClassNames.inputRoot = o.input
        ? `${styles.input} ${o.input}`
        : styles.input;
      mergedClassNames.listbox = o.dropdown
        ? `${styles.dropdown} ${o.dropdown}`
        : styles.dropdown;
      mergedClassNames.option = o.option
        ? `${styles.option} ${o.option}`
        : styles.option;
    }

    const wrapperClass = className
      ? `${styles.layoutOverride} ${className}`
      : styles.layoutOverride;

    return (
      <WithReadOnlyWrapper
        className={wrapperClass}
        style={style as React.CSSProperties}
        controlMaxWidth="var(--recursica_ui-kit_components_autocomplete_properties_max-width)"
        controlMinWidth="var(--recursica_ui-kit_components_autocomplete_properties_min-width)"
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
        error={!!error}
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
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { InputProps, ...restParams } = params;
              return (
                <MuiTextField
                  {...restParams}
                  placeholder={placeholder}
                  variant="standard"
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

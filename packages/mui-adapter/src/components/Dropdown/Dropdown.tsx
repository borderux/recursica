import React, { forwardRef, ReactNode } from "react";
import {
  Select as MuiSelect,
  SelectProps as MuiSelectProps,
  MenuItem,
} from "@mui/material";
import { type ReadOnlyControlProps } from "@recursica/adapter-common";
import {
  filterStylingProps,
  omitUnsupportedProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import { type RecursicaFormControlWrapperProps } from "../FormControlWrapper/FormControlWrapper";
import { WithReadOnlyWrapper } from "../ReadOnlyField/WithReadOnlyWrapper";
import styles from "./Dropdown.module.css";

import { type RecursicaDropdownProps as BaseRecursicaDropdownProps } from "@recursica/adapter-common";

export interface RecursicaDropdownProps
  extends Omit<
      MuiSelectProps,
      | keyof React.HTMLAttributes<HTMLDivElement>
      | "size"
      | "variant"
      | "classes"
      | "inputProps"
      | "SelectDisplayProps"
      | "ref"
      | "error"
    >,
    Omit<
      RecursicaFormControlWrapperProps,
      "controlMaxWidth" | "controlMinWidth"
    >,
    ReadOnlyControlProps,
    BaseRecursicaDropdownProps {}

export type DropdownProps = RecursicaOverStyled<RecursicaDropdownProps>;

export const Dropdown = forwardRef<HTMLInputElement, DropdownProps>(
  function Dropdown(props, ref) {
    const {
      overStyled = false,
      formLayout = "stacked",
      containerWidth,

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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      searchable, // Not natively supported by basic MUI Select, stubbed
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      clearable, // Not natively supported by basic MUI Select, stubbed
      ...rest
    } = props;
    // Props this component intentionally doesn't support — deleted at runtime so they can't leak
    // through even if a caller forces them via plain JavaScript, bypassing the Omit<> above.
    const UNSUPPORTED_PROPS = [
      "size", // Recursica controls sizing via design tokens, not MUI's native small/medium size
      "variant", // Recursica styles the naked select directly; MUI's standard/filled/outlined unused
    ] as const satisfies readonly (keyof MuiSelectProps)[];

    const sanitizedProps = omitUnsupportedProps(
      filterStylingProps(rest, overStyled),
      UNSUPPORTED_PROPS,
    );
    const restRecord = sanitizedProps as Record<string, unknown>;

    const injectedStyles = {
      ...((style as React.CSSProperties) || {}),
      width: containerWidth || "100%",
    };

    const wrapperClass = className
      ? `${styles.layoutOverride} ${className}`
      : styles.layoutOverride;

    const renderOptions = () => {
      if (!data) return null;
      return data.map((item, index) => {
        if (typeof item === "string") {
          return (
            <MenuItem
              key={`${item}-${index}`}
              value={item}
              className={styles.option}
              // Dropdown.module.css's own selected-state tint (`.option[data-selected="true"]`)
              // needs this explicitly — MUI's own `Mui-selected` class carries its default primary-
              // color tint instead, which is what shows through without it.
              data-selected={
                item === (value ?? defaultValue) ? "true" : undefined
              }
            >
              {item}
            </MenuItem>
          );
        }
        return (
          <MenuItem
            key={`${item.value}-${index}`}
            value={item.value}
            disabled={item.disabled}
            className={styles.option}
            data-selected={
              item.value === (value ?? defaultValue) ? "true" : undefined
            }
          >
            {item.label}
          </MenuItem>
        );
      });
    };

    return (
      <WithReadOnlyWrapper
        className={wrapperClass}
        style={injectedStyles}
        controlMaxWidth="var(--dropdown-control-max-width)"
        controlMinWidth="var(--dropdown-control-min-width)"
        overStyled={overStyled as true}
        formLayout={formLayout}
        labelSize={labelSize}
        labelAlignment={labelAlignment}
        labelOptionalText={labelOptionalText}
        labelWithEditIcon={labelWithEditIcon}
        onLabelEditClick={onLabelEditClick}
        label={label as ReactNode}
        assistiveText={assistiveText}
        assistiveWithIcon={assistiveWithIcon}
        error={!!error}
        required={required}
        id={id}
        readOnly={readOnly}
        readOnlyComponent={readOnlyComponent}
        emptyValueComponent={emptyValueComponent}
        readOnlyType="text"
        readOnlyValue={
          value !== undefined
            ? String(value)
            : defaultValue
              ? String(defaultValue)
              : undefined
        }
        readOnlyNativeProps={props}
        activeComponent={
          <MuiSelect
            ref={ref}
            {...(sanitizedProps as unknown as MuiSelectProps)}
            disabled={disabled}
            value={value}
            defaultValue={defaultValue}
            error={!!error}
            required={required}
            displayEmpty
            className={styles.root}
            classes={{
              select: styles.input,
              icon: styles.icon,
            }}
            MenuProps={{
              classes: { paper: styles.dropdown },
            }}
            // Dropdown.module.css's error/disabled state rules key off `.root[data-error]`/
            // `[data-disabled]` (the outer Select element, matching the `className={styles.root}`
            // above) — `inputProps` below only reaches the nested accessibility <input>, which that
            // selector never matches, so these need to be set here too. (Previously only set via
            // inputProps, which meant the error border never actually appeared on the Dropdown.)
            data-disabled={disabled ? "true" : undefined}
            data-error={error ? "true" : undefined}
            inputProps={{
              "data-disabled": disabled ? "true" : undefined,
              "data-error": error ? "true" : undefined,
              ...(restRecord.inputProps as Record<string, unknown>),
            }}
          >
            {renderOptions()}
          </MuiSelect>
        }
      />
    );
  },
);

Dropdown.displayName = "Dropdown";

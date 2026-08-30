import React, { forwardRef, ReactNode, useEffect, useState } from "react";
import {
  Select as MuiSelect,
  SelectProps as MuiSelectProps,
  SelectChangeEvent,
  MenuItem,
} from "@mui/material";
import {
  type ReadOnlyControlProps,
  normalizeComboboxData,
} from "@recursica/adapter-common";
import {
  filterStylingProps,
  omitUnsupportedProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import { type RecursicaFormControlWrapperProps } from "../FormControlWrapper/FormControlWrapper";
import { WithReadOnlyWrapper } from "../ReadOnlyField/WithReadOnlyWrapper";
import { renderRichOptionContent } from "../../utils/renderRichOption";
import { ChevronIcon, ClearIcon } from "./Dropdown.icons";
import styles from "./Dropdown.module.css";

import { type RecursicaDropdownProps as BaseRecursicaDropdownProps } from "@recursica/adapter-common";

// Swapped in for MUI's default `IconComponent` only when we're rendering our own combined
// clear+chevron `endAdornment` (see `showClear` below) — a stable reference so it isn't recreated
// every render.
function HiddenIcon() {
  return null;
}

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
    // `onChange` is swept up by the `keyof React.HTMLAttributes<HTMLDivElement>` omission above
    // (it's a standard DOM attribute name too) even though MUI's own `Select#onChange` has a
    // completely different, non-DOM signature — add it back explicitly with MUI's real signature.
    Pick<MuiSelectProps, "onChange">,
    Omit<
      RecursicaFormControlWrapperProps,
      "controlMaxWidth" | "controlMinWidth" | "onChange"
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
      onChange,
      data,
      startAdornment,
      clearable,
      wrapItemText = false,
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

    // MUI's basic `Select` has no built-in "clearable" concept (unlike Mantine's `Select`, which
    // manages its own internal value so it can reset itself to `null` on demand) — the clear
    // button needs somewhere to write an empty value to, so the value is lifted here rather than
    // left for MUI's own internal uncontrolled state.
    const [internalValue, setInternalValue] = useState<unknown>(
      () => value ?? defaultValue ?? "",
    );

    useEffect(() => {
      if (value !== undefined) setInternalValue(value);
    }, [value]);

    const handleChange = (
      event: SelectChangeEvent<unknown>,
      child: ReactNode,
    ) => {
      setInternalValue(event.target.value);
      (
        onChange as
          | ((event: SelectChangeEvent<unknown>, child: ReactNode) => void)
          | undefined
      )?.(event, child);
    };

    const hasValue =
      internalValue !== "" &&
      internalValue !== null &&
      internalValue !== undefined;
    const showClear = !!clearable && hasValue && !disabled && !readOnly;

    const handleClear = (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setInternalValue("");
      (
        onChange as
          | ((event: SelectChangeEvent<unknown>, child: ReactNode) => void)
          | undefined
      )?.({ target: { value: "" } } as SelectChangeEvent<unknown>, null);
    };

    const injectedStyles = {
      ...((style as React.CSSProperties) || {}),
      width: containerWidth || "100%",
    };

    const wrapperClass = className
      ? `${styles.layoutOverride} ${className}`
      : styles.layoutOverride;

    const optionClassNames = {
      optionContent: styles.optionContent,
      optionIcon: styles.optionIcon,
      optionText: styles.optionText,
      optionTextWrap: styles.optionTextWrap,
      optionSupportingText: styles.optionSupportingText,
    };

    // See AutoComplete.tsx's identical use of `normalizeComboboxData` (adapter-common) — items
    // always have a real `label` after this, so downstream code doesn't need its own `?? value`
    // fallback at every read.
    const normalizedData = normalizeComboboxData(data);

    const renderOptions = () => {
      if (!normalizedData) return null;
      return normalizedData.map((item, index) => {
        if (typeof item === "string") {
          return (
            <MenuItem
              key={`${item}-${index}`}
              value={item}
              className={styles.option}
              disableRipple
              // Dropdown.module.css's own selected-state tint (`.option[data-selected="true"]`)
              // needs this explicitly — MUI's own `Mui-selected` class carries its default primary-
              // color tint instead, which is what shows through without it.
              data-selected={item === internalValue ? "true" : undefined}
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
            disableRipple
            data-selected={item.value === internalValue ? "true" : undefined}
          >
            {renderRichOptionContent(item, optionClassNames, wrapItemText)}
          </MenuItem>
        );
      });
    };

    // MUI's closed-field display otherwise mirrors the selected `MenuItem`'s children directly —
    // now that those can be a rich icon+label+supportingText row, `renderValue` keeps the closed
    // field showing just the plain label, matching the field's own single-line text control.
    const renderValue = (selected: unknown) => {
      if (selected === "" || selected === undefined || selected === null) {
        return "";
      }
      const match = normalizedData?.find((item) =>
        typeof item === "string" ? item === selected : item.value === selected,
      );
      if (!match) return "";
      return typeof match === "string" ? match : match.label;
    };

    const wrappedStartAdornment = startAdornment ? (
      <span className={styles.section} data-position="left">
        {startAdornment}
      </span>
    ) : undefined;

    const wrappedEndAdornment = showClear ? (
      <span className={styles.section} data-position="right">
        <button
          type="button"
          className={styles.clearButton}
          aria-label="Clear"
          onClick={handleClear}
        >
          <ClearIcon />
        </button>
        <ChevronIcon />
      </span>
    ) : undefined;

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
            value={internalValue}
            onChange={handleChange}
            error={!!error}
            required={required}
            displayEmpty
            renderValue={renderValue}
            className={styles.root}
            classes={{
              select: styles.input,
              icon: styles.icon,
            }}
            IconComponent={showClear ? HiddenIcon : undefined}
            startAdornment={wrappedStartAdornment}
            endAdornment={wrappedEndAdornment}
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
            data-with-left-section={startAdornment ? "true" : undefined}
            data-with-right-section={showClear ? "true" : undefined}
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

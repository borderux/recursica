import React, { forwardRef } from "react";
import {
  Select as MuiSelect,
  type SelectProps as MuiSelectProps,
  MenuItem,
} from "@mui/material";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Dropdown.module.css";

/**
 * Bare, unwrapped Select — no `FormControlWrapper`/`WithReadOnlyWrapper`, no label/assistiveText/
 * error/required. Tied to the same `Dropdown.module.css` variables/classes as the public
 * `Dropdown` component, so it looks identical, but is meant to be embedded inside another
 * component that already owns its own `FormControlWrapper` (e.g. `TimePicker`'s AM/PM control) —
 * nesting the full `Dropdown` there would double up `FormControl`/`FormControlLayout` wrapping.
 *
 * Not exported from this folder's `index.ts` — internal use only. Import it directly:
 * `import { BareDropdown } from "../Dropdown/BareDropdown"`.
 */
export interface BareDropdownProps
  extends Omit<
    MuiSelectProps,
    "size" | "variant" | "classes" | "error" | "onChange"
  > {
  data: (
    | string
    | { value: string; label: React.ReactNode; disabled?: boolean }
  )[];
  /** Normalized to just the selected value, unlike MUI's raw (event, child) Select onChange. */
  onChange?: (value: string | null) => void;
  /** Applies the error visual state (via `data-error`) — no error message is rendered here. */
  error?: boolean;
}

export type BareDropdownComponentProps = RecursicaOverStyled<BareDropdownProps>;

export const BareDropdown = forwardRef<
  HTMLInputElement,
  BareDropdownComponentProps
>(function BareDropdown(props, ref) {
  const {
    overStyled = false,
    disabled,
    data,
    onChange,
    className,
    value,
    defaultValue,
    error,
    ...rest
  } = props;
  const sanitizedProps = filterStylingProps(rest, overStyled);
  const restRecord = sanitizedProps as Record<string, unknown>;

  delete restRecord["size"];
  delete restRecord["variant"];
  // className is merged explicitly below — don't let the spread further down silently overwrite
  // styles.root with just the caller's own class.
  delete restRecord["className"];

  const mergedClassName = className
    ? `${styles.root} ${className}`
    : styles.root;

  const selectedValue = value ?? defaultValue;

  const renderOptions = () =>
    data.map((item, index) => {
      if (typeof item === "string") {
        return (
          <MenuItem
            key={`${item}-${index}`}
            value={item}
            className={styles.option}
            // Dropdown.module.css's own selected-state tint (`.option[data-selected="true"]`) needs
            // this explicitly — MUI's own `Mui-selected` class carries its default primary-color
            // tint instead, which is what shows through without it.
            data-selected={item === selectedValue ? "true" : undefined}
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
          data-selected={item.value === selectedValue ? "true" : undefined}
        >
          {item.label}
        </MenuItem>
      );
    });

  return (
    <MuiSelect
      ref={ref}
      disabled={disabled}
      value={value}
      defaultValue={defaultValue}
      onChange={(event) => onChange?.((event.target.value as string) ?? null)}
      displayEmpty
      error={!!error}
      className={mergedClassName}
      classes={{
        select: styles.input,
        icon: styles.icon,
      }}
      MenuProps={{
        classes: { paper: styles.dropdown },
      }}
      // Dropdown.module.css's error/disabled state rules key off `.root[data-error]`/
      // `[data-disabled]` (the outer Select element, matching mergedClassName above) —
      // `inputProps` only reaches the nested accessibility <input>, which that selector never
      // matches, so these need to be set here too (mirrors the same fix in Dropdown.tsx).
      data-disabled={disabled ? "true" : undefined}
      data-error={error ? "true" : undefined}
      inputProps={{
        "data-disabled": disabled ? "true" : undefined,
        "data-error": error ? "true" : undefined,
        ...(restRecord.inputProps as Record<string, unknown>),
      }}
      {...(sanitizedProps as unknown as MuiSelectProps)}
    >
      {renderOptions()}
    </MuiSelect>
  );
});

BareDropdown.displayName = "BareDropdown";

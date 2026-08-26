import { forwardRef } from "react";
import {
  Select as MuiSelect,
  type SelectProps as MuiSelectProps,
  MenuItem,
} from "@mui/material";
import {
  type RecursicaComboboxData,
  normalizeComboboxData,
} from "@recursica/adapter-common";
import {
  filterStylingProps,
  omitUnsupportedProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import { renderRichOptionContent } from "../../utils/renderRichOption";
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
  data: RecursicaComboboxData;
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
  // Props this component intentionally doesn't support — deleted at runtime so they can't leak
  // through even if a caller forces them via plain JavaScript, bypassing the Omit<> above.
  const UNSUPPORTED_PROPS = [
    "size", // Recursica controls sizing via design tokens, not MUI's native small/medium size
    "variant", // Recursica styles the naked select directly; MUI's standard/filled/outlined unused
    "classes", // Recursica computes its own classes object below; caller's would silently clobber it
  ] as const satisfies readonly (keyof MuiSelectProps)[];

  const sanitizedProps = omitUnsupportedProps(
    filterStylingProps(rest, overStyled),
    UNSUPPORTED_PROPS,
  );
  const restRecord = sanitizedProps as Record<string, unknown>;

  const mergedClassName = className
    ? `${styles.root} ${className}`
    : styles.root;

  const selectedValue = value ?? defaultValue;

  const optionClassNames = {
    optionContent: styles.optionContent,
    optionIcon: styles.optionIcon,
    optionText: styles.optionText,
    optionTextWrap: styles.optionTextWrap,
    optionSupportingText: styles.optionSupportingText,
  };

  // See Dropdown.tsx's identical use of `normalizeComboboxData` (adapter-common).
  const normalizedData = normalizeComboboxData(data) ?? [];

  const renderOptions = () =>
    normalizedData.map((item, index) => {
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
          {renderRichOptionContent(item, optionClassNames)}
        </MenuItem>
      );
    });

  // See Dropdown.tsx's identical `renderValue` — keeps the closed field showing just the plain
  // label now that a MenuItem's children can be a rich icon+label+supportingText row.
  const renderValue = (selected: unknown) => {
    if (selected === "" || selected === undefined || selected === null) {
      return "";
    }
    const match = normalizedData.find((item) =>
      typeof item === "string" ? item === selected : item.value === selected,
    );
    if (!match) return "";
    return typeof match === "string" ? match : match.label;
  };

  return (
    <MuiSelect
      ref={ref}
      {...(sanitizedProps as unknown as MuiSelectProps)}
      disabled={disabled}
      value={value}
      defaultValue={defaultValue}
      onChange={(event) => onChange?.((event.target.value as string) ?? null)}
      displayEmpty
      renderValue={renderValue}
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
    >
      {renderOptions()}
    </MuiSelect>
  );
});

BareDropdown.displayName = "BareDropdown";

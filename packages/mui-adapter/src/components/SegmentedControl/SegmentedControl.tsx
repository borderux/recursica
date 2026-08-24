import { forwardRef, useState } from "react";
import {
  ToggleButtonGroup as MuiSegmentedControl,
  ToggleButton,
  type ToggleButtonGroupProps as MuiSegmentedControlProps,
} from "@mui/material";
import {
  filterStylingProps,
  omitUnsupportedProps,
  mergeClassNames,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./SegmentedControl.module.css";

import { type RecursicaSegmentedControlProps } from "@recursica/adapter-common";

export type SegmentedControlProps = RecursicaOverStyled<
  Omit<
    MuiSegmentedControlProps,
    | "variant"
    | "size"
    | "radius"
    | "color"
    | "classNames"
    | "className"
    | "disabled"
    | "value"
  > & {
    className?: string;
    classNames?: Partial<Record<string, string>>;
  } & RecursicaSegmentedControlProps
>;

function useSegmentedControlClassNames(restRecord: Record<string, unknown>): {
  className: string;
  classNames: Partial<Record<string, string>>;
} {
  const mergedClassNames = mergeClassNames(
    {
      root: styles.root,
      control: styles.control,
      label: styles.label,
    },
    restRecord.classNames as Partial<Record<string, string>> | undefined,
  );

  const classNameProp = restRecord.className as string | undefined;
  const finalClass = classNameProp
    ? `${styles.root} ${classNameProp}`
    : styles.root;

  return { className: finalClass, classNames: mergedClassNames };
}

const _SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(
  function SegmentedControl(
    {
      overStyled = false,
      orientation = "horizontal",
      fullWidth,
      data = [],
      value,
      onChange,
      ...rest
    },
    ref,
  ) {
    // Props this component intentionally doesn't support — deleted at runtime so they can't leak
    // through even if a caller forces them via plain JavaScript, bypassing the Omit<> above.
    const UNSUPPORTED_PROPS = [
      "disabled", // Recursica controls per-item disabled state via `data.disabled`, not the group
    ] as const satisfies readonly (keyof MuiSegmentedControlProps)[];

    const sanitizedProps = omitUnsupportedProps(
      filterStylingProps(rest, overStyled),
      UNSUPPORTED_PROPS,
    );
    const restRecord = sanitizedProps as Record<string, unknown>;

    const stylingParams = useSegmentedControlClassNames(restRecord);

    // MUI's ToggleButtonGroup is controlled-only and selects nothing when `value` is
    // undefined; Mantine's SegmentedControl instead defaults to the first data item. Track an
    // uncontrolled fallback so both adapters render the same default selection.
    const firstValue = data.length
      ? typeof data[0] === "string"
        ? data[0]
        : data[0].value
      : undefined;
    const [uncontrolledValue, setUncontrolledValue] = useState<
      string | undefined
    >(value ?? firstValue);
    const activeValue = value !== undefined ? value : uncontrolledValue;

    const handleChange = (
      event: React.MouseEvent<HTMLElement>,
      newValue: string | null,
    ) => {
      if (newValue !== null) {
        setUncontrolledValue(newValue);
        onChange?.(event, newValue);
      }
    };

    return (
      <MuiSegmentedControl
        ref={ref}
        {...(sanitizedProps as Omit<
          MuiSegmentedControlProps,
          "variant" | "size" | "value" | "onChange"
        >)}
        className={stylingParams.className}
        classes={stylingParams.classNames}
        orientation={orientation}
        fullWidth={fullWidth}
        data-orientation={orientation}
        exclusive
        value={activeValue}
        onChange={
          handleChange as React.ComponentProps<
            typeof MuiSegmentedControl
          >["onChange"]
        }
      >
        {data.map((item) => {
          const itemValue = typeof item === "string" ? item : item.value;
          const itemLabel = typeof item === "string" ? item : item.label;
          const itemDisabled = typeof item === "string" ? false : item.disabled;
          const itemIcon = typeof item === "string" ? undefined : item.icon;

          return (
            <ToggleButton
              key={itemValue}
              value={itemValue}
              disabled={itemDisabled}
              className={stylingParams.classNames.control}
            >
              <div className={stylingParams.classNames.label}>
                {itemIcon}
                {itemLabel}
              </div>
            </ToggleButton>
          );
        })}
      </MuiSegmentedControl>
    );
  },
);
_SegmentedControl.displayName = "SegmentedControl";

/**
 * Recursica SegmentedControl component wrapping Mui's SegmentedControl.
 */
export const SegmentedControl = _SegmentedControl;

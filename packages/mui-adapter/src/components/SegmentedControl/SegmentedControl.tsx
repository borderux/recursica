import { forwardRef } from "react";
import {
  ToggleButtonGroup as MuiSegmentedControl,
  ToggleButton,
  type ToggleButtonGroupProps as MuiSegmentedControlProps,
} from "@mui/material";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./SegmentedControl.module.css";

export interface RecursicaSegmentedControlProps {
  /** The orientation of the control */
  orientation?: "horizontal" | "vertical";
  /** If true, the control will take up the full width of its container */
  fullWidth?: boolean;
  /**
   * SegmentedControl should NOT be allowed to be disabled by design.
   * This component explicitly disables the `disabled` prop.
   */
  disabled?: never;
  /** Data to generate the control options */
  data?: Array<
    string | { label: React.ReactNode; value: string; disabled?: boolean }
  >;
  value?: string;
  onChange?: (value: string) => void;
}

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
    | "onChange"
  > & {
    className?: string;
    classNames?: Partial<Record<string, string>>;
  } & RecursicaSegmentedControlProps
>;

function useSegmentedControlClassNames(restRecord: Record<string, unknown>): {
  className: string;
  classNames: Partial<Record<string, string>>;
} {
  const mergedClassNames: Partial<Record<string, string>> = {
    root: styles.root,
    control: styles.control,
    label: styles.label,
    indicator: styles.indicator,
  };

  const classNamesProp = restRecord.classNames;
  if (
    classNamesProp &&
    typeof classNamesProp === "object" &&
    !Array.isArray(classNamesProp)
  ) {
    const o = classNamesProp as Partial<Record<string, string>>;
    mergedClassNames.root = o.root ? `${styles.root} ${o.root}` : styles.root;
    mergedClassNames.control = o.control
      ? `${styles.control} ${o.control}`
      : styles.control;
    mergedClassNames.label = o.label
      ? `${styles.label} ${o.label}`
      : styles.label;
    mergedClassNames.indicator = o.indicator
      ? `${styles.indicator} ${o.indicator}`
      : styles.indicator;
  }

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
    const sanitizedProps = filterStylingProps(rest, overStyled);
    const restRecord = sanitizedProps as Record<string, unknown>;

    // Explicitly prevent consumers from bypassing the disabled restriction
    delete restRecord["disabled"];

    const stylingParams = useSegmentedControlClassNames(restRecord);

    const handleChange = (
      _event: React.MouseEvent<HTMLElement>,
      newValue: string | null,
    ) => {
      if (newValue !== null && onChange) {
        onChange(newValue);
      }
    };

    return (
      <MuiSegmentedControl
        ref={ref}
        className={stylingParams.className}
        classes={stylingParams.classNames}
        orientation={orientation}
        fullWidth={fullWidth}
        data-orientation={orientation}
        exclusive
        value={value}
        onChange={handleChange as any}
        {...(sanitizedProps as Omit<
          MuiSegmentedControlProps,
          "variant" | "size" | "value" | "onChange"
        >)}
      >
        {data.map((item) => {
          const itemValue = typeof item === "string" ? item : item.value;
          const itemLabel = typeof item === "string" ? item : item.label;
          const itemDisabled = typeof item === "string" ? false : item.disabled;

          return (
            <ToggleButton
              key={itemValue}
              value={itemValue}
              disabled={itemDisabled}
              className={stylingParams.classNames.control}
            >
              <div className={stylingParams.classNames.label}>{itemLabel}</div>
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

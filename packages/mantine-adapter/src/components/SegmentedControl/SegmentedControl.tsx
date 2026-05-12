import { forwardRef } from "react";
import {
  SegmentedControl as MantineSegmentedControl,
  type SegmentedControlProps as MantineSegmentedControlProps,
} from "@mantine/core";
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
}

export type SegmentedControlProps = RecursicaOverStyled<
  Omit<
    MantineSegmentedControlProps,
    "variant" | "size" | "radius" | "color" | "classNames" | "className"
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
    { overStyled = false, orientation = "horizontal", fullWidth, ...rest },
    ref,
  ) {
    const sanitizedProps = filterStylingProps(rest, overStyled);
    const stylingParams = useSegmentedControlClassNames(
      sanitizedProps as Record<string, unknown>,
    );

    return (
      <MantineSegmentedControl
        ref={ref}
        className={stylingParams.className}
        classNames={stylingParams.classNames}
        orientation={orientation}
        fullWidth={fullWidth}
        data-orientation={orientation}
        {...(sanitizedProps as Omit<
          MantineSegmentedControlProps,
          "variant" | "size"
        >)}
      />
    );
  },
);
_SegmentedControl.displayName = "SegmentedControl";

/**
 * Recursica SegmentedControl component wrapping Mantine's SegmentedControl.
 */
export const SegmentedControl = _SegmentedControl;

import { forwardRef } from "react";
import {
  SegmentedControl as MantineSegmentedControl,
  type SegmentedControlProps as MantineSegmentedControlProps,
} from "@mantine/core";
import {
  filterStylingProps,
  omitUnsupportedProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./SegmentedControl.module.css";

import { type RecursicaSegmentedControlProps } from "@recursica/adapter-common";

export type SegmentedControlProps = RecursicaOverStyled<
  Omit<
    MantineSegmentedControlProps,
    | "variant"
    | "size"
    | "radius"
    | "color"
    | "classNames"
    | "className"
    | "disabled"
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
    // Props this component intentionally doesn't support — deleted at runtime so they can't leak
    // through even if a caller forces them via plain JavaScript, bypassing the `Omit<>` above.
    const UNSUPPORTED_PROPS = [
      // SegmentedControl only supports per-item disabling via the `data` array (each item may set
      // its own `disabled`); a top-level `disabled` is intentionally unsupported (typed as `never`
      // in RecursicaSegmentedControlProps) because Mantine's top-level `disabled` would disable
      // the whole control uniformly instead of per-item.
      "disabled",
    ] as const satisfies readonly (keyof MantineSegmentedControlProps)[];

    const sanitizedProps = omitUnsupportedProps(
      filterStylingProps(rest, overStyled) as Record<string, unknown>,
      UNSUPPORTED_PROPS,
    ) as Partial<typeof rest>;
    const restRecord = sanitizedProps as Record<string, unknown>;

    const stylingParams = useSegmentedControlClassNames(restRecord);

    return (
      <MantineSegmentedControl
        ref={ref}
        {...(sanitizedProps as Omit<
          MantineSegmentedControlProps,
          "variant" | "size"
        >)}
        className={stylingParams.className}
        classNames={stylingParams.classNames}
        orientation={orientation}
        fullWidth={fullWidth}
        data-orientation={orientation}
      />
    );
  },
);
_SegmentedControl.displayName = "SegmentedControl";

/**
 * Recursica SegmentedControl component wrapping Mantine's SegmentedControl.
 */
export const SegmentedControl = _SegmentedControl;

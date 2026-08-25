import { forwardRef } from "react";
import {
  SegmentedControl as MantineSegmentedControl,
  type SegmentedControlProps as MantineSegmentedControlProps,
} from "@mantine/core";
import {
  filterStylingProps,
  mergeClassNames,
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
    | "data"
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
      indicator: styles.indicator,
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
      ...rest
    },
    ref,
  ) {
    const sanitizedProps = filterStylingProps(rest, overStyled) as Partial<
      typeof rest
    >;
    const restRecord = sanitizedProps as Record<string, unknown>;

    const stylingParams = useSegmentedControlClassNames(restRecord);

    // Mantine's own data item has no icon slot; compose one into `label` (already a ReactNode)
    // so Mantine's native innerLabel wrapper lays it out using the icon-size/gap tokens already
    // wired in SegmentedControl.module.css.
    const mappedData = data.map((item) =>
      typeof item === "string" || !item.icon
        ? item
        : {
            ...item,
            label: (
              <>
                {item.icon}
                {item.label}
              </>
            ),
          },
    );

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
        data={mappedData}
      />
    );
  },
);
_SegmentedControl.displayName = "SegmentedControl";

/**
 * Recursica SegmentedControl component wrapping Mantine's SegmentedControl.
 */
export const SegmentedControl = _SegmentedControl;

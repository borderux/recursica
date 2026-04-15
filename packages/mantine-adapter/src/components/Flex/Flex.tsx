import React, { forwardRef } from "react";
import {
  Flex as MantineFlex,
  type FlexProps as MantineFlexProps,
} from "@mantine/core";
import {
  filterStylingProps,
  type RecursicaOverStyled,
  type RecursicaSpacing,
} from "../../utils/filterStylingProps";
import styles from "./Flex.module.css";

export interface RecursicaFlexProps {
  /**
   * Children components inside the Flex container
   */
  children?: React.ReactNode;
  gap?: MantineFlexProps["gap"] | RecursicaSpacing;
  rowGap?: MantineFlexProps["gap"] | RecursicaSpacing;
  columnGap?: MantineFlexProps["gap"] | RecursicaSpacing;
}

/**
 * Flex layout wrapper
 */
export type FlexProps = RecursicaOverStyled<
  MantineFlexProps & RecursicaFlexProps
>;

export const Flex = forwardRef<HTMLDivElement, FlexProps>(function Flex(
  { children, overStyled = false, gap = "rec-default", ...rest },
  ref,
) {
  const sanitizedProps = filterStylingProps({ ...rest, gap }, overStyled);
  const restRecord = sanitizedProps as Record<string, unknown>;

  const mergedClassNames: Partial<Record<string, string>> = {
    root: styles.root,
  };

  const classNamesProp = restRecord.classNames;
  if (
    classNamesProp &&
    typeof classNamesProp === "object" &&
    !Array.isArray(classNamesProp)
  ) {
    const o = classNamesProp as Partial<Record<string, string>>;
    mergedClassNames.root = o.root ? `${styles.root} ${o.root}` : styles.root;
  }

  const classNameProp = restRecord.className as string | undefined;
  const finalClass = classNameProp
    ? `${styles.root} ${classNameProp}`
    : styles.root;

  return (
    <MantineFlex
      ref={ref}
      className={finalClass}
      classNames={mergedClassNames}
      {...sanitizedProps}
    >
      {children}
    </MantineFlex>
  );
});

Flex.displayName = "Flex";

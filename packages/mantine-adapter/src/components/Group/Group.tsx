import React, { forwardRef } from "react";
import {
  Group as MantineGroup,
  type GroupProps as MantineGroupProps,
} from "@mantine/core";
import {
  filterStylingProps,
  type RecursicaOverStyled,
  type RecursicaSpacing,
} from "../../utils/filterStylingProps";
import styles from "./Group.module.css";

export interface RecursicaGroupProps {
  /**
   * Children components inside the group
   */
  children?: React.ReactNode;
  gap?: MantineGroupProps["gap"] | RecursicaSpacing;
  rowGap?: MantineGroupProps["gap"] | RecursicaSpacing;
  columnGap?: MantineGroupProps["gap"] | RecursicaSpacing;
}

/**
 * Group flex layout wrapper
 */
export type GroupProps = RecursicaOverStyled<
  MantineGroupProps & RecursicaGroupProps
>;

export const Group = forwardRef<HTMLDivElement, GroupProps>(function Group(
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
    <MantineGroup
      ref={ref}
      className={finalClass}
      classNames={mergedClassNames}
      {...sanitizedProps}
    >
      {children}
    </MantineGroup>
  );
});

Group.displayName = "Group";

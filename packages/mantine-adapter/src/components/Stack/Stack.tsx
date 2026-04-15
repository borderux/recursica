import React, { forwardRef } from "react";
import {
  Stack as MantineStack,
  type StackProps as MantineStackProps,
} from "@mantine/core";
import {
  filterStylingProps,
  type RecursicaOverStyled,
  type RecursicaSpacing,
} from "../../utils/filterStylingProps";
import styles from "./Stack.module.css";

export interface RecursicaStackProps {
  /**
   * Children components inside the stack
   */
  children?: React.ReactNode;
  gap?: MantineStackProps["gap"] | RecursicaSpacing;
}

/**
 * Stack flex layout wrapper
 */
export type StackProps = RecursicaOverStyled<
  MantineStackProps & RecursicaStackProps
>;

export const Stack = forwardRef<HTMLDivElement, StackProps>(function Stack(
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
    <MantineStack
      ref={ref}
      className={finalClass}
      classNames={mergedClassNames}
      {...sanitizedProps}
    >
      {children}
    </MantineStack>
  );
});

Stack.displayName = "Stack";

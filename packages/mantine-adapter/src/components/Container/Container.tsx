import React, { forwardRef } from "react";
import {
  Container as MantineContainer,
  type ContainerProps as MantineContainerProps,
} from "@mantine/core";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Container.module.css";

export interface RecursicaContainerProps {
  /**
   * Children components inside the layout container
   */
  children?: React.ReactNode;
}

/**
 * Container layout wrapper
 */
export type ContainerProps = RecursicaOverStyled<
  MantineContainerProps & RecursicaContainerProps
>;

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  function Container({ children, overStyled = false, ...rest }, ref) {
    const sanitizedProps = filterStylingProps(rest, overStyled);
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
      <MantineContainer
        ref={ref}
        className={finalClass}
        classNames={mergedClassNames}
        {...sanitizedProps}
      >
        {children}
      </MantineContainer>
    );
  },
);

Container.displayName = "Container";

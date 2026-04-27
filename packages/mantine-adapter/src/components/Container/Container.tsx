import React, { forwardRef } from "react";
import {
  Container as MantineContainer,
  type ContainerProps as MantineContainerProps,
} from "@mantine/core";
import {
  filterStylingProps,
  type RecursicaOverStyled,
  type RecursicaSpacing,
} from "../../utils/filterStylingProps";
import styles from "./Container.module.css";

export interface RecursicaContainerProps {
  /**
   * Children components inside the layout container
   */
  children?: React.ReactNode;
  /**
   * Maximum width defined by Mantine system sizes or Recursica sizes
   */
  size?:
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | RecursicaSpacing
    | (string & {})
    | number;
}

/**
 * Container layout wrapper
 */
export type ContainerProps = RecursicaOverStyled<
  Omit<MantineContainerProps, "size"> & RecursicaContainerProps
>;

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  function Container({ children, size, overStyled = false, ...rest }, ref) {
    const sanitizedProps = filterStylingProps(rest, overStyled);
    const restRecord = sanitizedProps as Record<string, unknown>;

    const mapSize: Record<string, string> = {
      "rec-sm": "sm",
      "rec-default": "md",
      "rec-md": "md",
      "rec-lg": "lg",
      "rec-xl": "xl",
      "rec-2xl": "xl",
    };

    const resolvedSize =
      typeof size === "string" && mapSize[size] ? mapSize[size] : size;

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
        size={resolvedSize}
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

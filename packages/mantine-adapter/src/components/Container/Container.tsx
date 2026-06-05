import { forwardRef } from "react";
import {
  Container as MantineContainer,
  type ContainerProps as MantineContainerProps,
} from "@mantine/core";
import styles from "./Container.module.css";

import { type RecursicaContainerProps } from "@recursica/adapter-common";

/**
 * Container layout wrapper.
 *
 * Note: Unlike complex UI components, primitive layout components (Flex, Stack, Group, Container)
 * DO NOT use the `RecursicaOverStyled` gatekeeper. Developers must be able to freely pass
 * width, height, padding, margins, and flexbox alignment props to construct structural layouts.
 */
export type ContainerProps = Omit<MantineContainerProps, "size"> &
  RecursicaContainerProps;

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  function Container({ children, size, ...rest }, ref) {
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

    const classNamesProp = rest.classNames;
    if (
      classNamesProp &&
      typeof classNamesProp === "object" &&
      !Array.isArray(classNamesProp)
    ) {
      const o = classNamesProp as Partial<Record<string, string>>;
      mergedClassNames.root = o.root ? `${styles.root} ${o.root}` : styles.root;
    }

    const classNameProp = rest.className as string | undefined;
    const finalClass = classNameProp
      ? `${styles.root} ${classNameProp}`
      : styles.root;

    return (
      <MantineContainer
        ref={ref}
        size={resolvedSize}
        className={finalClass}
        classNames={mergedClassNames}
        {...rest}
      >
        {children}
      </MantineContainer>
    );
  },
);

Container.displayName = "Container";

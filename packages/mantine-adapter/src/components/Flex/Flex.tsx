import { forwardRef } from "react";
import {
  Flex as MantineFlex,
  type FlexProps as MantineFlexProps,
  createPolymorphicComponent,
} from "@mantine/core";
import { type RecursicaSpacing } from "../../utils/filterStylingProps";
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
 * Flex layout wrapper.
 *
 * Note: Unlike complex UI components, primitive layout components (Flex, Stack, Group, Container)
 * DO NOT use the `RecursicaOverStyled` gatekeeper. Developers must be able to freely pass
 * width, height, padding, margins, and flexbox alignment props to construct structural layouts.
 */
export type FlexProps = MantineFlexProps & RecursicaFlexProps;

const _Flex = forwardRef<HTMLDivElement, FlexProps>(function Flex(
  { children, gap = "rec-default", ...rest },
  ref,
) {
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
    <MantineFlex
      ref={ref}
      className={finalClass}
      classNames={mergedClassNames}
      gap={gap}
      {...rest}
    >
      {children}
    </MantineFlex>
  );
});
_Flex.displayName = "Flex";

/**
 * Recursica Flex layout wrapper.
 *
 * Supports polymorphism via the `component` prop or `renderRoot` for custom element rendering.
 * @example
 * ```tsx
 * <Flex component="nav">...</Flex>
 * <Flex component="section">...</Flex>
 * ```
 */
export const Flex = createPolymorphicComponent<"div", FlexProps>(_Flex);

import { forwardRef } from "react";
import {
  Stack as MantineStack,
  type StackProps as MantineStackProps,
  createPolymorphicComponent,
} from "@mantine/core";
import {
  mapLayoutProps,
  type WithRecursicaSpacing,
} from "../../utils/filterStylingProps";
import styles from "./Stack.module.css";

/**
 * Stack flex layout wrapper.
 *
 * Note: Unlike complex UI components, primitive layout components (Flex, Stack, Group, Container)
 * DO NOT use the `RecursicaOverStyled` gatekeeper. Developers must be able to freely pass
 * width, height, padding, margins, and flexbox alignment props to construct structural layouts.
 *
 * No formal Recursica prop contract here: this simply passes through Mantine's own
 * `StackProps` (gap/align/justify are all native to Mantine), layered only with rec-
 * spacing token support via `WithRecursicaSpacing`.
 */
export type StackProps = WithRecursicaSpacing<MantineStackProps>;

const _Stack = forwardRef<HTMLDivElement, StackProps>(function Stack(
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
    <MantineStack
      ref={ref}
      className={finalClass}
      classNames={mergedClassNames}
      {...mapLayoutProps({ gap, ...rest } as Record<string, unknown>)}
    >
      {children}
    </MantineStack>
  );
});
_Stack.displayName = "Stack";

export const Stack = createPolymorphicComponent<"div", StackProps>(_Stack);

import { forwardRef } from "react";
import {
  Group as MantineGroup,
  type GroupProps as MantineGroupProps,
} from "@mantine/core";
import { mapLayoutProps } from "../../utils/filterStylingProps";
import styles from "./Group.module.css";

import { type RecursicaGroupProps } from "@recursica/adapter-common";

/**
 * Group flex layout wrapper.
 *
 * Note: Unlike complex UI components, primitive layout components (Flex, Stack, Group, Container)
 * DO NOT use the `RecursicaOverStyled` gatekeeper. Developers must be able to freely pass
 * width, height, padding, margins, and flexbox alignment props to construct structural layouts.
 */
export type GroupProps = MantineGroupProps & RecursicaGroupProps;

export const Group = forwardRef<HTMLDivElement, GroupProps>(function Group(
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
    <MantineGroup
      ref={ref}
      className={finalClass}
      classNames={mergedClassNames}
      {...mapLayoutProps({ gap, ...rest } as Record<string, unknown>)}
    >
      {children}
    </MantineGroup>
  );
});

Group.displayName = "Group";

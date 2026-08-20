import { forwardRef } from "react";
import {
  Badge as MantineBadge,
  type BadgeProps as MantineBadgeProps,
  createPolymorphicComponent,
} from "@mantine/core";
import {
  filterStylingProps,
  mergeClassNames,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Badge.module.css";

import { type RecursicaBadgeProps } from "@recursica/adapter-common";

export type BadgeProps = RecursicaOverStyled<
  Omit<MantineBadgeProps, "variant" | "size" | "color" | "radius"> &
    RecursicaBadgeProps
>;

const _Badge = forwardRef<HTMLDivElement, BadgeProps>(function Badge(
  { variant = "primary-color", overStyled = false, ...rest },
  ref,
) {
  // Strip all visual override injections unless developer has specifically opted into overStyling.
  // External layout props like margins are safely preserved.
  const sanitizedProps = filterStylingProps(rest, overStyled);

  const mergedClassNames = mergeClassNames(
    {
      root: styles.root,
      section: styles.section,
      label: styles.label,
    },
    (sanitizedProps as Record<string, unknown>).classNames as
      | Partial<Record<string, string>>
      | undefined,
  );

  const classNameProp = (sanitizedProps as Record<string, unknown>)
    .className as string | undefined;
  const finalClass = classNameProp
    ? `${styles.root} ${classNameProp}`
    : styles.root;

  return (
    <MantineBadge
      ref={ref}
      {...sanitizedProps}
      variant="filled" // We manage visual style purely through our CSS variables mapping
      data-variant={variant}
      className={finalClass}
      classNames={mergedClassNames}
    />
  );
});
_Badge.displayName = "Badge";

/**
 * Recursica Badge component wrapping Mantine's Badge.
 *
 * Supports polymorphism via the `component` prop or `renderRoot` for custom element rendering.
 */
export const Badge = createPolymorphicComponent<"div", BadgeProps>(_Badge);

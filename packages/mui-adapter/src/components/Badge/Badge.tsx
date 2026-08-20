import { forwardRef } from "react";
import {
  Badge as MuiBadge,
  type BadgeProps as MuiBadgeProps,
} from "@mui/material";
import {
  filterStylingProps,
  mergeClassNames,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Badge.module.css";

import { type RecursicaBadgeProps } from "@recursica/adapter-common";

export type BadgeProps = RecursicaOverStyled<
  Omit<MuiBadgeProps, "variant" | "size" | "color" | "radius"> &
    RecursicaBadgeProps
>;

const _Badge = forwardRef<HTMLDivElement, BadgeProps>(function Badge(
  { variant = "primary-color", overStyled = false, ...rest },
  ref,
) {
  // Strip all visual override injections unless developer has specifically opted into overStyling.
  // External layout props like margins are safely preserved.
  const sanitizedProps = filterStylingProps(rest, overStyled);

  // Note MUI's actual prop is "classes", not "classNames" (that's Mantine's naming) — this
  // used to read the wrong key, silently no-op-ing any caller-supplied classes.
  const mergedClassNames = mergeClassNames(
    { root: styles.root },
    (sanitizedProps as Record<string, unknown>).classes as
      | Partial<Record<string, string>>
      | undefined,
  );

  const classNameProp = (sanitizedProps as Record<string, unknown>)
    .className as string | undefined;
  const finalClass = classNameProp
    ? `${styles.root} ${classNameProp}`
    : styles.root;

  return (
    <MuiBadge
      ref={ref}
      variant="standard" // We manage visual style purely through our CSS variables mapping
      data-variant={variant}
      {...sanitizedProps}
      className={finalClass}
      classes={mergedClassNames}
    />
  );
});
_Badge.displayName = "Badge";

/**
 * Recursica Badge component wrapping Mui's Badge.
 *
 * Supports polymorphism via the `component` prop or `renderRoot` for custom element rendering.
 */
export const Badge = _Badge;

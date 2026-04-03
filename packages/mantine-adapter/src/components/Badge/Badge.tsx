import { forwardRef } from "react";
import {
  Badge as MantineBadge,
  type BadgeProps as MantineBadgeProps,
} from "@mantine/core";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Badge.module.css";

export interface RecursicaBadgeProps {
  /** Map to the component styles defined in variables */
  variant?: "alert" | "primary-color" | "success" | "warning";
}

export type BadgeProps = RecursicaOverStyled<
  Omit<MantineBadgeProps, "variant" | "size" | "color" | "radius"> &
    RecursicaBadgeProps
>;

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(function Badge(
  { variant = "primary-color", overStyled = false, ...rest },
  ref,
) {
  // Strip all visual override injections unless developer has specifically opted into overStyling.
  // External layout props like margins are safely preserved.
  const sanitizedProps = filterStylingProps(rest, overStyled);

  const mergedClassNames: Partial<Record<string, string>> = {
    root: styles.root,
    section: styles.section,
    label: styles.label,
  };

  const classNamesProp = (sanitizedProps as Record<string, unknown>).classNames;
  if (
    classNamesProp &&
    typeof classNamesProp === "object" &&
    !Array.isArray(classNamesProp)
  ) {
    const o = classNamesProp as Partial<Record<string, string>>;
    mergedClassNames.root = o.root ? `${styles.root} ${o.root}` : styles.root;
    mergedClassNames.section = o.section ?? styles.section;
    mergedClassNames.label = o.label ?? styles.label;
  }

  const classNameProp = (sanitizedProps as Record<string, unknown>)
    .className as string | undefined;
  const finalClass = classNameProp
    ? `${styles.root} ${classNameProp}`
    : styles.root;

  return (
    <MantineBadge
      ref={ref}
      variant="filled" // We manage visual style purely through our CSS variables mapping
      data-variant={variant}
      {...sanitizedProps}
      className={finalClass}
      classNames={mergedClassNames}
    />
  );
});

Badge.displayName = "Badge";

import React, { forwardRef } from "react";
import {
  Button as MantineButton,
  type ButtonProps as MantineButtonProps,
} from "@mantine/core";
import { filterStylingProps } from "../../utils/filterStylingProps";
import styles from "./Button.module.css";

export interface RecursicaButtonProps {
  variant?: "solid" | "outline" | "text";
  size?: "default" | "small";
  icon?: React.ReactNode;
  /** If true, allows external style props to override Recursica base styles. Default: false */
  overStyled?: boolean;
}

export type ButtonProps = Omit<
  MantineButtonProps,
  "variant" | "size" | "leftSection"
> &
  RecursicaButtonProps;

function hasVisibleChildren(children: React.ReactNode): boolean {
  if (children == null || children === "") return false;
  if (typeof children === "string") return children.trim() !== "";
  return true;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "solid",
      size = "default",
      icon,
      children,
      overStyled = false,
      ...rest
    },
    ref,
  ) {
    const mapVariant = {
      solid: "filled",
      outline: "outline",
      text: "subtle",
    } as const;

    const mapSize = {
      default: "md",
      small: "sm",
    } as const;

    const sanitizedProps = filterStylingProps(rest, overStyled);
    const restRecord = sanitizedProps as Record<string, unknown>;

    const hasLeftSection = !!icon || !!restRecord["leftSection"];
    const hasRightSection = !!restRecord["rightSection"];
    const isIconOnly =
      (hasLeftSection || hasRightSection) && !hasVisibleChildren(children);

    if (
      typeof process !== "undefined" &&
      process.env.NODE_ENV !== "production" &&
      isIconOnly &&
      !restRecord["aria-label"]
    ) {
      console.warn(
        '[Recursica Button] Icon-only buttons must provide an accessible name. Pass aria-label (e.g. aria-label="Submit").',
      );
    }

    const mergedClassNames: Partial<Record<string, string>> = {
      root: styles.root,
      section: styles.section,
      label: styles.label,
    };

    if (
      sanitizedProps.classNames &&
      typeof sanitizedProps.classNames === "object" &&
      !Array.isArray(sanitizedProps.classNames)
    ) {
      const o = sanitizedProps.classNames as Partial<Record<string, string>>;
      mergedClassNames.root = o.root ? `${styles.root} ${o.root}` : styles.root;
      mergedClassNames.section = o.section ?? styles.section;
      mergedClassNames.label = o.label ?? styles.label;
    }

    const finalClass = sanitizedProps.className
      ? `${styles.root} ${sanitizedProps.className}`
      : styles.root;

    return (
      <MantineButton
        ref={ref}
        className={finalClass}
        classNames={mergedClassNames}
        variant={mapVariant[variant]}
        size={mapSize[size]}
        leftSection={
          icon != null ? (
            <span className={styles.iconWrapper} aria-hidden>
              {icon}
            </span>
          ) : undefined
        }
        data-variant={variant}
        data-size={size}
        {...(isIconOnly ? { "data-icon-only": "" } : {})}
        {...sanitizedProps}
      >
        <span className={styles.labelText}>{children}</span>
      </MantineButton>
    );
  },
);

Button.displayName = "Button";

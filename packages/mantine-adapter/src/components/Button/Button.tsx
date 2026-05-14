import React, { forwardRef } from "react";
import { Loader } from "../Loader/Loader";
import type { RecursicaLoaderProps } from "../Loader/Loader";
import {
  Button as MantineButton,
  type ButtonProps as MantineButtonProps,
  createPolymorphicComponent,
} from "@mantine/core";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Button.module.css";

export interface RecursicaButtonProps {
  /** The visual style variant of the button */
  variant?: "solid" | "outline" | "text";
  /** The size of the button */
  size?: "default" | "small";
  /** An optional icon element to display to the left of the button text. Replaces Mantine's leftSection. */
  icon?: React.ReactNode;
  /** Which Recursica Loader variant to use */
  loaderVariant?: RecursicaLoaderProps["variant"];
  /** The size variant for the loader */
  loaderSize?: RecursicaLoaderProps["size"];
  /** Whether to use the Recursica loader or fallback to the Mantine loader */
  useRecursicaLoader?: boolean;
}

export type ButtonProps = RecursicaOverStyled<
  Omit<MantineButtonProps, "variant" | "size" | "leftSection" | "fullWidth"> &
    RecursicaButtonProps
>;

function hasVisibleChildren(children: React.ReactNode): boolean {
  if (children == null || children === "") return false;
  if (typeof children === "string") return children.trim() !== "";
  return true;
}

const _Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "solid",
    size = "default",
    icon,
    children,
    overStyled = false,
    loaderVariant = "oval",
    loaderSize,
    useRecursicaLoader = true,
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

  // Explicitly delete blocked semantic expansion dimension props
  delete restRecord["fullWidth"];

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
    loader: styles.loader,
  };

  const classNamesProp = restRecord.classNames;
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

  const classNameProp = restRecord.className as string | undefined;
  const finalClass = classNameProp
    ? `${styles.root} ${classNameProp}`
    : styles.root;

  const userLoaderProps = restRecord.loaderProps as
    | Record<string, any>
    | undefined;

  const resolvedLoaderSize =
    loaderSize ?? (size === "small" ? "small" : "default");

  let mergedLoaderProps = userLoaderProps;
  if (useRecursicaLoader) {
    mergedLoaderProps = {
      children: <Loader variant={loaderVariant} size={resolvedLoaderSize} />,
      ...userLoaderProps,
    };
  }

  return (
    <MantineButton
      ref={ref}
      className={finalClass}
      classNames={mergedClassNames}
      variant={mapVariant[variant]}
      size={mapSize[size]}
      loaderProps={mergedLoaderProps}
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
      disabled={!!restRecord.disabled || !!restRecord.loading}
    >
      <span className={styles.labelText}>{children}</span>
    </MantineButton>
  );
});
_Button.displayName = "Button";

/**
 * Recursica Button component wrapping Mantine's Button.
 *
 * Supports polymorphism via the `component` prop or `renderRoot` for custom element rendering.
 * This is particularly useful when you need a button that behaves as a hyperlink (rendering an `<a>` tag)
 * or integrates with a routing library (e.g., `react-router-dom` or Next.js), while preserving full visual styling.
 *
 * @example
 * ```tsx
 * // Renders as an <a> tag natively
 * <Button component="a" href="/dashboard" target="_blank">Navigate</Button>
 *
 * // Renders using a custom router link
 * <Button renderRoot={(props) => <Link to="/home" {...props} />}>Home</Button>
 * ```
 */
export const Button = createPolymorphicComponent<"button", ButtonProps>(
  _Button,
);

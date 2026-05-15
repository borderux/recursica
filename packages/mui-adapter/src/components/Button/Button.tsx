import React, { forwardRef } from "react";
import { Loader } from "../Loader/Loader";
import type { RecursicaLoaderProps } from "../Loader/Loader";
import {
  Button as MuiButton,
  type ButtonProps as MuiButtonProps,
} from "@mui/material";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Button.module.css";

export interface RecursicaButtonProps {
  variant?: "solid" | "outline" | "text";
  size?: "default" | "small";
  icon?: React.ReactNode;
  /**
   * For polymorphic support (e.g., `component="a"`), native to MUI.
   */
  component?: React.ElementType;
  /** Which Recursica Loader variant to use */
  loaderVariant?: RecursicaLoaderProps["variant"];
  /** The size variant for the loader */
  loaderSize?: RecursicaLoaderProps["size"];
  /** Whether to use the Recursica loader or fallback to the Mantine loader */
  useRecursicaLoader?: boolean;
}

export type ButtonProps = RecursicaOverStyled<
  Omit<MuiButtonProps, "variant" | "size" | "color" | "fullWidth"> &
    RecursicaButtonProps
>;

function hasVisibleChildren(children: React.ReactNode): boolean {
  if (children == null || children === "") return false;
  if (typeof children === "string") return children.trim() !== "";
  return true;
}

/**
 * Recursica Button component wrapping MUI's Button.
 *
 * Supports polymorphism via the `component` prop for custom element rendering.
 * This is particularly useful when you need a button that behaves as a hyperlink (rendering an `<a>` tag)
 * or integrates with a routing library (e.g., `react-router-dom` or Next.js), while preserving full visual styling.
 *
 * @example
 * ```tsx
 * // Renders as an <a> tag natively
 * <Button component="a" href="/dashboard" target="_blank">Navigate</Button>
 *
 * // Renders using a custom router link
 * <Button component={Link} to="/home">Home</Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
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
    const sanitizedProps = filterStylingProps(rest, overStyled);
    const restRecord = sanitizedProps as Record<string, unknown>;

    // Explicitly delete blocked semantic expansion dimension props that MUI uses natively
    delete restRecord["fullWidth"];
    delete restRecord["color"]; // Recursica handles colors internally via tokens

    const hasStartIcon = !!icon || !!restRecord["startIcon"];
    const hasEndIcon = !!restRecord["endIcon"];
    const isIconOnly =
      (hasStartIcon || hasEndIcon) && !hasVisibleChildren(children);

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

    const classNameProp = restRecord.className as string | undefined;
    const finalClass = classNameProp
      ? `${styles.root} ${classNameProp}`
      : styles.root;

    // We don't map Recursica variant/size to MUI's because we want to completely disable MUI's native
    // variant logic (e.g., elevation, shadows) and style everything strictly through our CSS Modules.
    // However, Mui Button requires some string, but we can just leave it as standard or ignore since
    // our CSS resets its properties anyway, but to be clean we just don't pass variant to MUI.

    const resolvedLoaderSize =
      loaderSize ?? (size === "small" ? "small" : "default");

    let loadingIndicator = restRecord.loadingIndicator as React.ReactNode;
    if (useRecursicaLoader) {
      loadingIndicator = (
        <Loader variant={loaderVariant} size={resolvedLoaderSize} />
      );
    }

    return (
      <MuiButton
        ref={ref}
        disableRipple
        disableElevation
        className={finalClass}
        loading={!!restRecord.loading}
        loadingIndicator={loadingIndicator}
        startIcon={
          icon != null ? (
            <span className={styles.iconWrapper} aria-hidden>
              {icon}
            </span>
          ) : undefined
        }
        data-variant={variant}
        data-size={size}
        {...(isIconOnly ? { "data-icon-only": "" } : {})}
        {...(restRecord.loading ? { "data-loading": "true" } : {})}
        {...sanitizedProps}
        disabled={!!restRecord.disabled || !!restRecord.loading}
      >
        <span className={styles.labelText}>{children}</span>
      </MuiButton>
    );
  },
);

Button.displayName = "Button";

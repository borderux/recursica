import React, { forwardRef } from "react";
import { Loader } from "../Loader/Loader";
import {
  Button as MantineButton,
  type ButtonProps as MantineButtonProps,
  createPolymorphicComponent,
} from "@mantine/core";
import {
  filterStylingProps,
  omitUnsupportedProps,
  withCallerOverride,
  mergeClassNames,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Button.module.css";

import { type RecursicaButtonProps } from "@recursica/adapter-common";

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

  // Props this component intentionally doesn't support — deleted at runtime so they can't leak
  // through even if a caller forces them via plain JavaScript, bypassing the `Omit<>` above.
  const UNSUPPORTED_PROPS = [
    "fullWidth", // Recursica Button width comes from layout/token constraints, not Mantine's boolean fullWidth toggle.
  ] as const satisfies readonly (keyof MantineButtonProps)[];

  const sanitizedProps = omitUnsupportedProps(
    filterStylingProps(rest, overStyled) as Record<string, unknown>,
    UNSUPPORTED_PROPS,
  ) as Partial<typeof rest>;
  const restRecord = sanitizedProps as Record<string, unknown>;

  const hasLeftSection = !!icon || !!restRecord["leftSection"];
  const hasRightSection = !!restRecord["rightSection"];
  const hasVisibleText = hasVisibleChildren(children);
  const isIconOnly = (hasLeftSection || hasRightSection) && !hasVisibleText;

  let contentType = "label";
  if (isIconOnly) {
    contentType = "icon-only";
  } else if (hasLeftSection || hasRightSection) {
    contentType = "icon-label";
  }

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

  const mergedClassNames = mergeClassNames(
    {
      root: styles.root,
      section: styles.section,
      label: styles.label,
      loader: styles.loader,
    },
    restRecord.classNames as Partial<Record<string, string>> | undefined,
  );

  const classNameProp = restRecord.className as string | undefined;
  const finalClass = classNameProp
    ? `${styles.root} ${classNameProp}`
    : styles.root;
  // Note: `finalClass` is safe from being clobbered by `{...sanitizedProps}` below purely
  // because of spread order — `className` (like `classNames`, `variant`, `size`, `leftSection`,
  // and the `data-*` attributes) is spread first, then re-asserted after, so our computed value
  // always wins. See the canonical guide's §3.3 for why ordering (not deletion) is the fix here.

  const userLoaderProps = restRecord.loaderProps as
    | Record<string, unknown>
    | undefined;

  const resolvedLoaderSize = withCallerOverride(
    size === "small" ? "small" : "default",
    loaderSize,
  );

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
      {...sanitizedProps}
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
      data-content={contentType}
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

import { forwardRef } from "react";
import {
  Title as MantineTitle,
  type TitleProps as MantineTitleProps,
} from "@mantine/core";
import {
  filterStylingProps,
  omitUnsupportedProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";

import { type RecursicaTitleProps } from "@recursica/adapter-common";
import styles from "./Title.module.css";

export type TitleProps = RecursicaOverStyled<
  Omit<MantineTitleProps, "size"> & RecursicaTitleProps
>;

/**
 * Enforces highly accessible structural markup utilizing semantic `<h1>` through `<h6>` tags securely bound directly to Recursica typographic scales.
 */
export const Title = forwardRef<HTMLHeadingElement, TitleProps>(function Title(
  { overStyled = false, order = 1, ...rest },
  ref,
) {
  // Props this component intentionally doesn't support — deleted at runtime so they can't leak
  // through even if a caller forces them via plain JavaScript, bypassing the `Omit<>` above.
  const UNSUPPORTED_PROPS = [
    "size", // Recursica controls Title sizing via the `order` prop + typography tokens, not Mantine's native `size`.
  ] as const satisfies readonly (keyof MantineTitleProps)[];

  const sanitizedProps = omitUnsupportedProps(
    filterStylingProps(rest, overStyled),
    UNSUPPORTED_PROPS,
  );
  const classNameProp = (sanitizedProps as Record<string, unknown>)
    .className as string | undefined;

  const typographyClass = `recursica_brand_typography_h${order}`;
  const mergedClassName = [typographyClass, styles.root, classNameProp]
    .filter(Boolean)
    .join(" ");

  return (
    <MantineTitle
      ref={ref}
      {...(sanitizedProps as unknown as MantineTitleProps)}
      order={order}
      className={mergedClassName}
    />
  );
});
Title.displayName = "Title";

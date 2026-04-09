import { forwardRef, type ReactNode } from "react";
import {
  Text as MantineText,
  type TextProps as MantineTextProps,
} from "@mantine/core";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";

export type TextVariant =
  | "body"
  | "body-small"
  | "caption"
  | "overline"
  | "subtitle"
  | "subtitle-small";

export type RecursicaTextProps = Omit<MantineTextProps, "variant"> & {
  /**
   * The explicit typography hierarchy dictated by Recursica's global design tokens.
   */
  variant?: TextVariant;
  children?: ReactNode;
};

export type TextProps = RecursicaOverStyled<RecursicaTextProps>;

/**
 * A generalized typographical wrapper limiting text properties to bounded Recursica UI-kit tokens inherently.
 * Do not use for semantic headings; use the explicit `<Title>` component for `<h1>` - `<h6>`.
 */
export const Text = forwardRef<HTMLDivElement, TextProps>(function Text(
  { overStyled = false, variant = "body", ...rest },
  ref,
) {
  const sanitizedProps = filterStylingProps(rest, overStyled);
  const classNameProp = (sanitizedProps as Record<string, unknown>)
    .className as string | undefined;

  const typographyClass = `recursica_brand_typography_${variant}`;
  const mergedClassName = classNameProp
    ? `${typographyClass} ${classNameProp}`
    : typographyClass;

  return (
    <MantineText
      ref={ref}
      className={mergedClassName}
      {...(sanitizedProps as unknown as MantineTextProps)}
    />
  );
});
Text.displayName = "Text";

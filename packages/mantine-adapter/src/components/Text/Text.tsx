import { forwardRef } from "react";
import {
  Text as MantineText,
  type TextProps as MantineTextProps,
  createPolymorphicComponent,
} from "@mantine/core";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";

import { type RecursicaTextProps } from "@recursica/adapter-common";

export type TextProps = RecursicaOverStyled<
  Omit<MantineTextProps, "variant"> & RecursicaTextProps
>;

const _Text = forwardRef<HTMLDivElement, TextProps>(function Text(
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
_Text.displayName = "Text";

/**
 * A generalized typographical wrapper limiting text properties to bounded Recursica UI-kit tokens inherently.
 * Do not use for semantic headings; use the explicit `<Title>` component for `<h1>` - `<h6>`.
 *
 * Supports polymorphism via the `component` prop or `renderRoot` for custom element rendering.
 * @example
 * ```tsx
 * <Text component="span">Inline text</Text>
 * <Text component="label" htmlFor="input-id">Label text</Text>
 * ```
 */
export const Text = createPolymorphicComponent<"p", TextProps>(_Text);

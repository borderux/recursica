import { forwardRef } from "react";
import {
  Title as MantineTitle,
  type TitleProps as MantineTitleProps,
} from "@mantine/core";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";

export type RecursicaTitleProps = Omit<MantineTitleProps, "order"> & {
  /**
   * Enforces semantic HTML headers (h1-h6) cleanly bound to native typographic scaling variables in the design system.
   */
  order?: 1 | 2 | 3 | 4 | 5 | 6;
};

export type TitleProps = RecursicaOverStyled<RecursicaTitleProps>;

/**
 * Enforces highly accessible structural markup utilizing semantic `<h1>` through `<h6>` tags securely bound directly to Recursica typographic scales.
 */
export const Title = forwardRef<HTMLHeadingElement, TitleProps>(function Title(
  { overStyled = false, order = 1, ...rest },
  ref,
) {
  const sanitizedProps = filterStylingProps(rest, overStyled);
  const classNameProp = (sanitizedProps as Record<string, unknown>)
    .className as string | undefined;

  const typographyClass = `recursica_brand_typography_h${order}`;
  const mergedClassName = classNameProp
    ? `${typographyClass} ${classNameProp}`
    : typographyClass;

  return (
    <MantineTitle
      ref={ref}
      order={order}
      className={mergedClassName}
      {...(sanitizedProps as unknown as MantineTitleProps)}
    />
  );
});
Title.displayName = "Title";

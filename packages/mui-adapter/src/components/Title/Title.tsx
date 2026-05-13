import React, { forwardRef } from "react";
import { Typography } from "../Typography/Typography";
import { type RecursicaOverStyled } from "../../utils/filterStylingProps";
import { type TypographyProps as MuiTypographyProps } from "@mui/material";

export type RecursicaTitleProps = Omit<MuiTypographyProps, "variant"> & {
  order?: 1 | 2 | 3 | 4 | 5 | 6;
  children?: React.ReactNode;
  component?: React.ElementType;
};

export type TitleProps = RecursicaOverStyled<RecursicaTitleProps>;

export const Title = forwardRef<HTMLElement, TitleProps>(function Title(
  { order = 1, component, ...rest },
  ref,
) {
  const typographyClass = `recursica_brand_typography_h${order}`;
  const defaultComponent = `h${order}` as React.ElementType;

  return (
    <Typography
      ref={ref}
      typographyClass={typographyClass}
      component={component || defaultComponent}
      {...rest}
    />
  );
});

Title.displayName = "Title";

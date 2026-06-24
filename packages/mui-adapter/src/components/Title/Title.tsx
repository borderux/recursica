import React, { forwardRef } from "react";
import { type TypographyProps as MuiTypographyProps } from "@mui/material";
import { Typography } from "../Typography/Typography";
import { type RecursicaOverStyled } from "../../utils/filterStylingProps";
import { type RecursicaTitleProps } from "@recursica/adapter-common";

export type TitleProps = RecursicaOverStyled<
  Omit<MuiTypographyProps, "variant" | "classes"> & RecursicaTitleProps
>;

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

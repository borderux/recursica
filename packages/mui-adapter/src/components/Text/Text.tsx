import React, { forwardRef } from "react";
import { Typography } from "../Typography/Typography";
import { type RecursicaOverStyled } from "../../utils/filterStylingProps";
import { type TypographyProps as MuiTypographyProps } from "@mui/material";

export type TextVariant =
  | "body"
  | "body-small"
  | "caption"
  | "overline"
  | "subtitle"
  | "subtitle-small";

export type RecursicaTextProps = Omit<MuiTypographyProps, "variant"> & {
  variant?: TextVariant;
  children?: React.ReactNode;
  component?: React.ElementType;
};

export type TextProps = RecursicaOverStyled<RecursicaTextProps>;

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  { variant = "body", ...rest },
  ref,
) {
  const typographyClass = `recursica_brand_typography_${variant}`;
  return <Typography ref={ref} typographyClass={typographyClass} {...rest} />;
});

Text.displayName = "Text";

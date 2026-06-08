import React, { forwardRef } from "react";
import { Typography } from "../Typography/Typography";
import { type RecursicaOverStyled } from "../../utils/filterStylingProps";
import { type RecursicaTextProps } from "@recursica/adapter-common";

export type TextProps = RecursicaOverStyled<RecursicaTextProps>;

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  { variant = "body", ...rest },
  ref,
) {
  const typographyClass = `recursica_brand_typography_${variant}`;
  return <Typography ref={ref} typographyClass={typographyClass} {...rest} />;
});

Text.displayName = "Text";

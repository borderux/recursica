import { forwardRef } from "react";
import { type TypographyProps as MuiTypographyProps } from "@mui/material";
import { Typography } from "../Typography/Typography";
import { type RecursicaOverStyled } from "../../utils/filterStylingProps";
import { type RecursicaTextProps } from "@recursica/adapter-common";
import styles from "./Text.module.css";

export type TextProps = RecursicaOverStyled<
  Omit<MuiTypographyProps, "variant" | "classes"> & RecursicaTextProps
>;

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  { variant = "body", emphasis = "high", state, ...rest },
  ref,
) {
  const typographyClass = `recursica_brand_typography_${variant} ${styles.root}`;
  return (
    <Typography
      ref={ref}
      typographyClass={typographyClass}
      data-emphasis={emphasis}
      data-state={state}
      {...rest}
    />
  );
});

Text.displayName = "Text";

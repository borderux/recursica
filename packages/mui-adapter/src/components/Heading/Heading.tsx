import React, { forwardRef } from "react";
import { type TypographyProps as MuiTypographyProps } from "@mui/material";
import { Typography } from "../Typography/Typography";
import { type RecursicaOverStyled } from "../../utils/filterStylingProps";
import { type RecursicaHeadingProps } from "@recursica/adapter-common";
import styles from "./Heading.module.css";

export type HeadingProps = RecursicaOverStyled<
  Omit<MuiTypographyProps, "variant" | "classes"> & RecursicaHeadingProps
>;

export const Heading = forwardRef<HTMLElement, HeadingProps>(function Heading(
  { order = 1, component, emphasis = "high", state, ...rest },
  ref,
) {
  const typographyClass = `recursica_brand_typography_h${order} ${styles.root}`;
  const defaultComponent = `h${order}` as React.ElementType;

  return (
    <Typography
      ref={ref}
      typographyClass={typographyClass}
      component={component || defaultComponent}
      data-emphasis={emphasis}
      data-state={state}
      {...rest}
    />
  );
});

Heading.displayName = "Heading";

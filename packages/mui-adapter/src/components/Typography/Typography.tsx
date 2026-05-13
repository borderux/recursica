import React, { forwardRef } from "react";
import {
  Typography as MuiTypography,
  type TypographyProps as MuiTypographyProps,
} from "@mui/material";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";

export type TypographyProps = RecursicaOverStyled<
  Omit<MuiTypographyProps, "variant"> & {
    /**
     * Internal typography class mapping
     */
    typographyClass: string;
    component?: React.ElementType;
  }
>;

export const Typography = forwardRef<HTMLElement, TypographyProps>(
  function Typography({ typographyClass, overStyled = false, ...rest }, ref) {
    const sanitizedProps = filterStylingProps(rest, overStyled);
    const restRecord = sanitizedProps as Record<string, unknown>;

    const classNameProp = restRecord.className as string | undefined;
    const finalClass = classNameProp
      ? `${typographyClass} ${classNameProp}`
      : typographyClass;

    return (
      <MuiTypography
        ref={ref}
        className={finalClass}
        variant="inherit"
        {...sanitizedProps}
      />
    );
  },
);

Typography.displayName = "Typography";

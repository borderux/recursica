import React, { forwardRef } from "react";
import { Box as MUIBox, type BoxProps as MUIBoxProps } from "@mui/material";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";

export type BoxProps<C extends React.ElementType = "div"> = RecursicaOverStyled<
  MUIBoxProps<C, { component?: C }>
>;

export const Box = forwardRef(function Box<C extends React.ElementType = "div">(
  props: BoxProps<C>,
  ref: React.Ref<Element>,
) {
  const { overStyled = false, ...rest } = props;

  const sanitizedProps = filterStylingProps(
    rest as Record<string, unknown>,
    overStyled,
  );

  return <MUIBox ref={ref} {...sanitizedProps} />;
}) as <C extends React.ElementType = "div">(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: BoxProps<C> & { ref?: React.ForwardedRef<any> },
) => React.ReactElement | null;

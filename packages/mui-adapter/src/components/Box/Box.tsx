/**
 * Box layout wrapper.
 *
 * NOTE: Box is the lowest-level primitive layout component. It explicitly ALLOWS
 * the `sx` prop as an escape hatch. It does not use the strict RecursicaOverStyled gatekeeper
 * or any style stripping utilities.
 */
import React, { forwardRef } from "react";
import { Box as MUIBox, type BoxProps as MUIBoxProps } from "@mui/material";

export type BoxProps<C extends React.ElementType = "div"> = MUIBoxProps<
  C,
  { component?: C }
>;

export const Box = forwardRef(function Box<C extends React.ElementType = "div">(
  props: BoxProps<C>,
  ref: React.Ref<Element>,
) {
  return <MUIBox ref={ref} {...props} />;
}) as <C extends React.ElementType = "div">(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: BoxProps<C> & { ref?: React.ForwardedRef<any> },
) => React.ReactElement | null;

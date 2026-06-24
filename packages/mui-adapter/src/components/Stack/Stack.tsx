import { forwardRef } from "react";
import {
  Stack as MUIStack,
  type StackProps as MUIStackProps,
} from "@mui/material";
import {
  SPACING_MAP,
  type OmitSx,
  filterSxProp,
  type WithRecursicaSpacing,
} from "../../utils/filterStylingProps";

import { type RecursicaStackProps } from "@recursica/adapter-common";

export type StackProps = WithRecursicaSpacing<
  OmitSx<Omit<MUIStackProps, "spacing"> & RecursicaStackProps>
>;

export const Stack = forwardRef<HTMLDivElement, StackProps>(function Stack(
  { children, gap = "rec-default", ...rest },
  ref,
) {
  const safeProps = filterSxProp(rest as Record<string, unknown>);
  const resolvedGap =
    typeof gap === "string" && gap in SPACING_MAP
      ? SPACING_MAP[gap as keyof typeof SPACING_MAP]
      : gap;

  return (
    <MUIStack ref={ref} spacing={resolvedGap} {...safeProps}>
      {children}
    </MUIStack>
  );
});

Stack.displayName = "Stack";

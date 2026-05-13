import React, { forwardRef } from "react";
import {
  Stack as MUIStack,
  type StackProps as MUIStackProps,
} from "@mui/material";
import {
  type RecursicaSpacing,
  SPACING_MAP,
  type OmitSx,
  filterSxProp,
} from "../../utils/filterStylingProps";

export interface RecursicaGroupProps {
  children?: React.ReactNode;
  gap?: MUIStackProps["spacing"] | RecursicaSpacing;
  rowGap?: MUIStackProps["spacing"] | RecursicaSpacing;
  columnGap?: MUIStackProps["spacing"] | RecursicaSpacing;
}

export type GroupProps = OmitSx<
  Omit<MUIStackProps, "spacing" | "direction"> & RecursicaGroupProps
>;

export const Group = forwardRef<HTMLDivElement, GroupProps>(function Group(
  { children, gap = "rec-default", rowGap, columnGap, ...rest },
  ref,
) {
  const safeProps = filterSxProp(rest as Record<string, unknown>);
  const resolvedGap =
    typeof gap === "string" && gap in SPACING_MAP
      ? SPACING_MAP[gap as keyof typeof SPACING_MAP]
      : gap;
  const resolvedRowGap =
    typeof rowGap === "string" && rowGap in SPACING_MAP
      ? SPACING_MAP[rowGap as keyof typeof SPACING_MAP]
      : rowGap;
  const resolvedColumnGap =
    typeof columnGap === "string" && columnGap in SPACING_MAP
      ? SPACING_MAP[columnGap as keyof typeof SPACING_MAP]
      : columnGap;

  return (
    <MUIStack
      ref={ref}
      direction="row"
      flexWrap="wrap"
      spacing={resolvedGap}
      sx={{
        ...(resolvedRowGap ? { rowGap: resolvedRowGap } : {}),
        ...(resolvedColumnGap ? { columnGap: resolvedColumnGap } : {}),
      }}
      {...safeProps}
    >
      {children}
    </MUIStack>
  );
});

Group.displayName = "Group";

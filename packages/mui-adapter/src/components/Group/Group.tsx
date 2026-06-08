import React, { forwardRef } from "react";
import {
  Stack as MUIStack,
  type StackProps as MUIStackProps,
} from "@mui/material";
import {
  SPACING_MAP,
  type OmitSx,
  filterSxProp,
} from "../../utils/filterStylingProps";

import { type RecursicaGroupProps } from "@recursica/adapter-common";

export type GroupProps = OmitSx<
  Omit<MUIStackProps, "spacing" | "direction"> & RecursicaGroupProps
>;

export const Group = forwardRef<HTMLDivElement, GroupProps>(function Group(
  {
    children,
    gap = "rec-default",
    rowGap,
    columnGap,
    justify,
    align,
    wrap,
    ...rest
  },
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
      flexWrap={wrap || "wrap"}
      justifyContent={justify}
      alignItems={align}
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

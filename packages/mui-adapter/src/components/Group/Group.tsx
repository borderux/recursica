/**
 * Group layout wrapper.
 *
 * NOTE: MUI has no native `<Group>` component. Per the layout-components rule, when a UI kit
 * lacks an equivalent component it's built following a prop definition similar to Mantine's
 * own `Group` (gap/rowGap/columnGap/justify/align/wrap) — this shape is owned locally here,
 * not shared as a formal cross-adapter Recursica contract. It's implemented as a row-direction,
 * wrapping MUI `Stack`.
 */
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

interface GroupOwnProps {
  /** Gap spacing */
  gap?: string | number;
  /** Row gap spacing */
  rowGap?: string | number;
  /** Column gap spacing */
  columnGap?: string | number;
  /** Align items justify properties */
  justify?: React.CSSProperties["justifyContent"];
  /** Align items vertical alignment */
  align?: React.CSSProperties["alignItems"];
  /** Flex-wrap settings */
  wrap?: React.CSSProperties["flexWrap"];
}

export type GroupProps = WithRecursicaSpacing<
  OmitSx<Omit<MUIStackProps, "spacing" | "direction"> & GroupOwnProps>
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
      {...safeProps}
      direction="row"
      flexWrap={wrap || "wrap"}
      justifyContent={justify}
      alignItems={align}
      spacing={resolvedGap}
      sx={{
        ...(resolvedRowGap ? { rowGap: resolvedRowGap } : {}),
        ...(resolvedColumnGap ? { columnGap: resolvedColumnGap } : {}),
      }}
    >
      {children}
    </MUIStack>
  );
});

Group.displayName = "Group";

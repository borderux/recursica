/**
 * Flex layout wrapper.
 *
 * NOTE: MUI does not have a native `<Flex>` component (it relies on `<Box display="flex">`
 * or `<Stack>`). Per the layout-components rule, when a UI kit lacks an equivalent component
 * it's built following a prop definition similar to Mantine's own `Flex` (gap/rowGap/columnGap/
 * direction/align/justify/wrap) — this shape is owned locally here, not shared as a formal
 * cross-adapter Recursica contract.
 *
 * Like Stack and Group, this is a primitive layout component. It strictly filters out the
 * `sx` prop using `OmitSx` and `filterSxProp` to enforce the use of standard layout scales.
 */
import { forwardRef } from "react";
import { Box as MUIBox, type BoxProps as MUIBoxProps } from "@mui/material";
import {
  SPACING_MAP,
  type OmitSx,
  filterSxProp,
  type WithRecursicaSpacing,
} from "../../utils/filterStylingProps";

interface FlexOwnProps {
  /** Global gap spacing key or CSS value */
  gap?: string | number;
  /** Horizontal row spacing */
  rowGap?: string | number;
  /** Vertical column spacing */
  columnGap?: string | number;
  /** Flex direction */
  direction?: React.CSSProperties["flexDirection"];
  /** Align items */
  align?: React.CSSProperties["alignItems"];
  /** Justify content */
  justify?: React.CSSProperties["justifyContent"];
  /** Flex wrap */
  wrap?: React.CSSProperties["flexWrap"];
}

export type FlexProps = WithRecursicaSpacing<
  OmitSx<MUIBoxProps & FlexOwnProps>
>;

export const Flex = forwardRef<HTMLDivElement, FlexProps>(function Flex(
  {
    children,
    gap = "rec-default",
    rowGap,
    columnGap,
    direction,
    align,
    justify,
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
    <MUIBox
      ref={ref}
      {...safeProps}
      display="flex"
      gap={resolvedGap}
      rowGap={resolvedRowGap}
      columnGap={resolvedColumnGap}
      flexDirection={direction}
      alignItems={align}
      justifyContent={justify}
      flexWrap={wrap}
    >
      {children}
    </MUIBox>
  );
});

Flex.displayName = "Flex";

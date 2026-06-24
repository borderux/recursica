/**
 * Flex layout wrapper.
 *
 * NOTE: MUI does not have a native `<Flex>` component (it relies on `<Box display="flex">`
 * or `<Stack>`). To maintain API parity with the mantine-adapter and provide a consistent
 * developer experience, this component wraps MUI's Box and forces `display="flex"`.
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

import { type RecursicaFlexProps } from "@recursica/adapter-common";

export type FlexProps = WithRecursicaSpacing<
  OmitSx<MUIBoxProps & RecursicaFlexProps>
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
      display="flex"
      {...safeProps}
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

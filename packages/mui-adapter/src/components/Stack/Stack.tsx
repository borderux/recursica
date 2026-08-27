/**
 * Stack layout wrapper.
 *
 * MUI has a native `Stack`, so this simply passes through its own props (`direction`,
 * `spacing`, `alignItems`, `justifyContent`, etc.) with no Recursica renaming — only
 * `spacing` gains `rec-*` token support via `WithRecursicaSpacing`.
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

export type StackProps = WithRecursicaSpacing<OmitSx<MUIStackProps>>;

export const Stack = forwardRef<HTMLDivElement, StackProps>(function Stack(
  { children, spacing = "rec-default", ...rest },
  ref,
) {
  const safeProps = filterSxProp(rest as Record<string, unknown>);
  const resolvedSpacing =
    typeof spacing === "string" && spacing in SPACING_MAP
      ? SPACING_MAP[spacing as keyof typeof SPACING_MAP]
      : spacing;

  return (
    <MUIStack
      ref={ref}
      {...(safeProps as unknown as MUIStackProps)}
      spacing={resolvedSpacing}
    >
      {children}
    </MUIStack>
  );
});

Stack.displayName = "Stack";

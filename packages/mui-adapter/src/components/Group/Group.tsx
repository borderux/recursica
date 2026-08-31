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
  // MUI's `sx`/system props treat spacing shorthands (`gap`, margin/padding
  // shorthands like `mt`, `p`, ...) as multiples of the theme's 8px unit
  // (e.g. `gap={8}` -> 64px, `mt={24}` -> 192px). Mantine's `Group` takes a
  // raw number as literal pixels, so numeric values must be stringified to
  // `px` here to opt out of that multiplication and keep parity.
  const resolveGap = (value: string | number | undefined) => {
    if (typeof value === "string" && value in SPACING_MAP) {
      return SPACING_MAP[value as keyof typeof SPACING_MAP];
    }
    return typeof value === "number" ? `${value}px` : value;
  };
  const resolvedGap = resolveGap(gap);
  const resolvedRowGap = resolveGap(rowGap);
  const resolvedColumnGap = resolveGap(columnGap);

  const MARGIN_PADDING_KEYS = [
    "m",
    "mt",
    "mr",
    "mb",
    "ml",
    "mx",
    "my",
    "p",
    "pt",
    "pr",
    "pb",
    "pl",
    "px",
    "py",
  ] as const;
  for (const key of MARGIN_PADDING_KEYS) {
    const value = safeProps[key];
    if (typeof value === "number") {
      safeProps[key] = `${value}px`;
    }
  }

  return (
    <MUIStack
      ref={ref}
      {...safeProps}
      direction="row"
      flexWrap={wrap || "wrap"}
      justifyContent={justify}
      alignItems={align}
      sx={{
        // Set gap directly instead of MUI Stack's `spacing` prop: `spacing`
        // multiplies numeric values by the theme's 8px spacing unit (e.g.
        // `gap={8}` -> 64px), while Mantine's `Group` treats a raw number as
        // literal pixels. Using `sx.gap` keeps numeric/px/token values 1:1.
        gap: resolvedGap,
        ...(resolvedRowGap ? { rowGap: resolvedRowGap } : {}),
        ...(resolvedColumnGap ? { columnGap: resolvedColumnGap } : {}),
      }}
    >
      {children}
    </MUIStack>
  );
});

Group.displayName = "Group";

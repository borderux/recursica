/**
 * Grid layout wrapper.
 *
 * NOTE: MUI merges "container" and "item" into a single Grid component (no separate
 * Grid.Col in the underlying library, and no native `order`, `justifyContent`,
 * `alignItems`, or breakpoint-visibility support). To preserve API parity with the
 * mantine-adapter (Grid + Grid.Col dot notation, matching Mantine's own Grid/Grid.Col),
 * this file splits MUI's single component back into two wrappers: Grid always renders
 * MUI's `<Grid container>`, GridCol always renders MUI's `<Grid>` in item mode.
 *
 * Like Flex, Stack, Group, and Container, this is a primitive layout component and
 * does not use the `RecursicaOverStyled` gatekeeper — only the `sx` prop is stripped.
 */
import {
  createContext,
  forwardRef,
  useContext,
  type CSSProperties,
} from "react";
import { Grid as MuiGrid, type GridProps as MuiGridProps } from "@mui/material";
import {
  SPACING_MAP,
  type OmitSx,
  filterSxProp,
  type WithRecursicaSpacing,
} from "../../utils/filterStylingProps";
import styles from "./Grid.module.css";

import {
  type RecursicaGridProps,
  type RecursicaGridColProps,
} from "@recursica/adapter-common";

type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl";
type RecursicaBreakpoint = "base" | Breakpoint;

const GridContext = createContext<{ grow: boolean }>({ grow: false });

/** Remaps the Recursica-only "base" breakpoint key to MUI's "xs" (its smallest breakpoint). */
function remapBase<T>(
  value: T | Partial<Record<RecursicaBreakpoint, T>> | undefined,
): T | Partial<Record<Breakpoint, T>> | undefined {
  if (value === undefined || typeof value !== "object") {
    return value as T | undefined;
  }
  const { base, ...rest } = value as Partial<Record<RecursicaBreakpoint, T>>;
  return base !== undefined
    ? ({ xs: base, ...rest } as Partial<Record<Breakpoint, T>>)
    : (rest as Partial<Record<Breakpoint, T>>);
}

/**
 * Recursica's "auto" (grow to fill remaining space) and "content" (size to content)
 * are the inverse of MUI's own "auto" (size to content) and "grow" (fill remaining
 * space) keywords.
 */
function mapSpanValue(
  value: number | "auto" | "content" | undefined,
): number | "auto" | "grow" | undefined {
  if (value === "auto") return "grow";
  if (value === "content") return "auto";
  return value;
}

function mapSpan(span: RecursicaGridColProps["span"]): MuiGridProps["size"] {
  const remapped = remapBase(span);
  if (remapped === undefined || typeof remapped !== "object") {
    return mapSpanValue(remapped as number | "auto" | "content" | undefined);
  }
  const mapped: Partial<Record<Breakpoint, number | "auto" | "grow">> = {};
  (
    Object.entries(remapped) as [Breakpoint, number | "auto" | "content"][]
  ).forEach(([key, value]) => {
    mapped[key] = mapSpanValue(value);
  });
  return mapped as MuiGridProps["size"];
}

function mapOffset(
  offset: RecursicaGridColProps["offset"],
): MuiGridProps["offset"] {
  return remapBase(offset) as MuiGridProps["offset"];
}

/**
 * `order` has no native MUI Grid equivalent. A fixed number is applied directly.
 * A responsive object is NOT fully supported in this v1 — the smallest specified
 * breakpoint's value is applied as a single static order (documented in
 * IMPLEMENTATION_NOTES.md), rather than building bespoke per-breakpoint CSS for it.
 */
function resolveOrder(
  order: RecursicaGridColProps["order"],
): number | undefined {
  if (order === undefined || typeof order === "number") {
    return order;
  }
  const remapped = remapBase(order) as Partial<Record<Breakpoint, number>>;
  return (
    remapped.xs ?? remapped.sm ?? remapped.md ?? remapped.lg ?? remapped.xl
  );
}

const HIDDEN_FROM_CLASS: Partial<Record<Breakpoint, string>> = {
  xs: styles.hiddenFromXs,
  sm: styles.hiddenFromSm,
  md: styles.hiddenFromMd,
  lg: styles.hiddenFromLg,
  xl: styles.hiddenFromXl,
};

// "xs"/"base" intentionally absent: visible from the smallest breakpoint means never hidden.
const VISIBLE_FROM_CLASS: Partial<Record<Breakpoint, string>> = {
  sm: styles.visibleFromSm,
  md: styles.visibleFromMd,
  lg: styles.visibleFromLg,
  xl: styles.visibleFromXl,
};

function normalizeBreakpoint(bp: RecursicaBreakpoint): Breakpoint {
  return bp === "base" ? "xs" : bp;
}

// ============================================================
// GRID
// ============================================================

export type GridProps = WithRecursicaSpacing<
  OmitSx<Omit<MuiGridProps, "container" | "size" | "offset">> &
    RecursicaGridProps
>;

const GridBase = forwardRef<HTMLDivElement, GridProps>(function Grid(
  {
    children,
    gap = "rec-default",
    columns = 12,
    grow = false,
    justify,
    align,
    style,
    ...rest
  },
  ref,
) {
  const safeProps = filterSxProp(rest as Record<string, unknown>);
  const resolvedGap =
    typeof gap === "string" && gap in SPACING_MAP
      ? SPACING_MAP[gap as keyof typeof SPACING_MAP]
      : gap;

  return (
    <GridContext.Provider value={{ grow }}>
      <MuiGrid
        ref={ref}
        container
        columns={columns}
        spacing={resolvedGap}
        className={styles.root}
        {...(safeProps as unknown as MuiGridProps)}
        style={{
          justifyContent: justify,
          alignItems: align,
          ...(style as CSSProperties),
        }}
      >
        {children}
      </MuiGrid>
    </GridContext.Provider>
  );
});
GridBase.displayName = "Grid";

// ============================================================
// GRID.COL
// ============================================================

export type GridColProps = WithRecursicaSpacing<
  OmitSx<Omit<MuiGridProps, "container" | "size" | "offset">> &
    RecursicaGridColProps
>;

export const GridCol = forwardRef<HTMLDivElement, GridColProps>(
  function GridCol(
    {
      children,
      span,
      offset,
      order,
      visibleFrom,
      hiddenFrom,
      style,
      className,
      ...rest
    },
    ref,
  ) {
    const { grow } = useContext(GridContext);
    const safeProps = filterSxProp(rest as Record<string, unknown>);
    const resolvedOrder = resolveOrder(order);

    const visibilityClass = visibleFrom
      ? VISIBLE_FROM_CLASS[normalizeBreakpoint(visibleFrom)]
      : hiddenFrom
        ? HIDDEN_FROM_CLASS[normalizeBreakpoint(hiddenFrom)]
        : undefined;

    const finalClassName = [styles.col, visibilityClass, className]
      .filter(Boolean)
      .join(" ");

    return (
      <MuiGrid
        ref={ref}
        size={mapSpan(span)}
        offset={mapOffset(offset)}
        className={finalClassName}
        {...(safeProps as unknown as MuiGridProps)}
        style={{
          order: resolvedOrder,
          ...(grow ? { flexGrow: 1 } : {}),
          ...(style as CSSProperties),
        }}
      >
        {children}
      </MuiGrid>
    );
  },
);
GridCol.displayName = "GridCol";

// ============================================================
// DOT NOTATION EXPORT
// ============================================================

type GridComponent = typeof GridBase & {
  Col: typeof GridCol;
};

export const Grid = GridBase as GridComponent;
Grid.Col = GridCol;

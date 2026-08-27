/**
 * Grid layout wrapper.
 *
 * MUI merges "container" and "item" into a single `Grid` component (no separate Grid.Col,
 * unlike Mantine). To preserve the Grid/Grid.Col dot-notation shape across adapters, this
 * file splits MUI's single component back into two thin wrappers: Grid always renders MUI's
 * `<Grid container>`, GridCol always renders a plain MUI `<Grid>` (item mode).
 *
 * Per the layout-components rule, both wrappers simply pass through MUI's own Grid props
 * (`size`, `offset`, `spacing`, `columns`, `direction`, `wrap`) with no Recursica renaming.
 * MUI has no per-item "grow to fill remaining space" container flag like Mantine's `grow`;
 * use MUI's own `size="grow"` on individual columns instead. `visibleFrom`/`hiddenFrom`
 * don't exist in MUI at all, so — per the rule that a missing kit feature is built following
 * Mantine's own shape — they're added here via CSS classes, keyed on MUI's own breakpoint
 * scale (`xs`/`sm`/`md`/`lg`/`xl`).
 *
 * `justifyContent`/`alignItems` (container) and `order` (item) are typed on `MuiGridProps`
 * (inherited generically from `SystemProps`) but MUI's Grid style generator — verified by
 * reading `@mui/system`'s `gridGenerator.js`/`createGrid.js` — only wires up `size`, `offset`,
 * `columns`, `spacing`/`rowSpacing`/`columnSpacing`, `direction`, and `wrap`; passing these
 * three straight through would silently no-op. They're pulled out and applied via inline
 * `style` instead, still using MUI's own native names.
 *
 * Like Flex, Stack, Group, and Container, this is a primitive layout component and
 * does not use the `RecursicaOverStyled` gatekeeper — only the `sx` prop is stripped.
 */
import { forwardRef, type CSSProperties } from "react";
import { Grid as MuiGrid, type GridProps as MuiGridProps } from "@mui/material";
import {
  SPACING_MAP,
  type OmitSx,
  filterSxProp,
  type WithRecursicaSpacing,
} from "../../utils/filterStylingProps";
import styles from "./Grid.module.css";

type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl";

const HIDDEN_FROM_CLASS: Record<Breakpoint, string> = {
  xs: styles.hiddenFromXs,
  sm: styles.hiddenFromSm,
  md: styles.hiddenFromMd,
  lg: styles.hiddenFromLg,
  xl: styles.hiddenFromXl,
};

// "xs" intentionally absent: visible from the smallest breakpoint means never hidden.
const VISIBLE_FROM_CLASS: Partial<Record<Breakpoint, string>> = {
  sm: styles.visibleFromSm,
  md: styles.visibleFromMd,
  lg: styles.visibleFromLg,
  xl: styles.visibleFromXl,
};

// ============================================================
// GRID
// ============================================================

export type GridProps = WithRecursicaSpacing<
  OmitSx<Omit<MuiGridProps, "container" | "justifyContent" | "alignItems">>
> & {
  /** Sets `justify-content` on the container. Applied via inline style — see notes above. */
  justifyContent?: CSSProperties["justifyContent"];
  /** Sets `align-items` on the container. Applied via inline style — see notes above. */
  alignItems?: CSSProperties["alignItems"];
};

const GridBase = forwardRef<HTMLDivElement, GridProps>(function Grid(
  {
    children,
    spacing = "rec-default",
    justifyContent,
    alignItems,
    style,
    ...rest
  },
  ref,
) {
  const safeProps = filterSxProp(rest as Record<string, unknown>);
  const resolvedSpacing =
    typeof spacing === "string" && spacing in SPACING_MAP
      ? SPACING_MAP[spacing as keyof typeof SPACING_MAP]
      : spacing;

  return (
    <MuiGrid
      ref={ref}
      {...(safeProps as unknown as MuiGridProps)}
      container
      spacing={resolvedSpacing}
      className={styles.root}
      style={{ justifyContent, alignItems, ...(style as CSSProperties) }}
    >
      {children}
    </MuiGrid>
  );
});
GridBase.displayName = "Grid";

// ============================================================
// GRID.COL
// ============================================================

export type GridColProps = WithRecursicaSpacing<
  OmitSx<Omit<MuiGridProps, "container" | "order">>
> & {
  /** Sets the CSS `order` property. Applied via inline style — see notes above. */
  order?: number;
  /** Hides the column below the given breakpoint. MUI has no native equivalent. */
  visibleFrom?: Breakpoint;
  /** Hides the column above the given breakpoint. MUI has no native equivalent. */
  hiddenFrom?: Breakpoint;
};

export const GridCol = forwardRef<HTMLDivElement, GridColProps>(
  function GridCol(
    { children, order, visibleFrom, hiddenFrom, style, className, ...rest },
    ref,
  ) {
    const safeProps = filterSxProp(rest as Record<string, unknown>);

    const visibilityClass = visibleFrom
      ? VISIBLE_FROM_CLASS[visibleFrom]
      : hiddenFrom
        ? HIDDEN_FROM_CLASS[hiddenFrom]
        : undefined;

    const finalClassName = [styles.col, visibilityClass, className]
      .filter(Boolean)
      .join(" ");

    return (
      <MuiGrid
        ref={ref}
        className={finalClassName}
        {...(safeProps as unknown as MuiGridProps)}
        style={{ order, ...(style as CSSProperties) }}
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

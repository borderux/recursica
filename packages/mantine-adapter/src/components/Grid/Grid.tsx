import { forwardRef } from "react";
import {
  Grid as MantineGrid,
  type GridProps as MantineGridProps,
  type GridColProps as MantineGridColProps,
  createPolymorphicComponent,
} from "@mantine/core";
import {
  mapLayoutProps,
  type WithRecursicaSpacing,
} from "../../utils/filterStylingProps";
import styles from "./Grid.module.css";

import {
  type RecursicaGridProps,
  type RecursicaGridColProps,
} from "@recursica/adapter-common";

/**
 * Grid layout wrapper.
 *
 * Note: Unlike complex UI components, primitive layout components (Flex, Stack, Group, Container, Grid)
 * DO NOT use the `RecursicaOverStyled` gatekeeper. Developers must be able to freely pass
 * width, height, padding, margins, and flexbox alignment props to construct structural layouts.
 */
export type GridProps = WithRecursicaSpacing<
  Omit<MantineGridProps, "gutter"> & RecursicaGridProps
>;

const _Grid = forwardRef<HTMLDivElement, GridProps>(function Grid(
  { children, gap = "rec-default", ...rest },
  ref,
) {
  const mergedClassNames: Partial<Record<string, string>> = {
    root: styles.root,
  };

  const classNamesProp = rest.classNames;
  if (
    classNamesProp &&
    typeof classNamesProp === "object" &&
    !Array.isArray(classNamesProp)
  ) {
    const o = classNamesProp as Partial<Record<string, string>>;
    mergedClassNames.root = o.root ? `${styles.root} ${o.root}` : styles.root;
  }

  const classNameProp = rest.className as string | undefined;
  const finalClass = classNameProp
    ? `${styles.root} ${classNameProp}`
    : styles.root;

  const { gap: gutter, ...mappedRest } = mapLayoutProps({
    gap,
    ...rest,
  } as Record<string, unknown>);

  return (
    <MantineGrid
      ref={ref}
      gutter={gutter as MantineGridProps["gutter"]}
      className={finalClass}
      classNames={mergedClassNames}
      {...(mappedRest as unknown as Omit<MantineGridProps, "gutter">)}
    >
      {children}
    </MantineGrid>
  );
});
_Grid.displayName = "Grid";

/**
 * Recursica Grid layout wrapper.
 *
 * Supports polymorphism via the `component` prop for custom element rendering.
 * @example
 * ```tsx
 * <Grid gap="rec-default">
 *   <Grid.Col span={6}>Half width</Grid.Col>
 *   <Grid.Col span={6}>Half width</Grid.Col>
 * </Grid>
 * ```
 */
const GridBase = createPolymorphicComponent<"div", GridProps>(_Grid);

// ============================================================
// GRID.COL
// ============================================================

export type GridColProps = WithRecursicaSpacing<
  MantineGridColProps & RecursicaGridColProps
>;

const _GridCol = forwardRef<HTMLDivElement, GridColProps>(function GridCol(
  { children, ...rest },
  ref,
) {
  const mergedClassNames: Partial<Record<string, string>> = {
    col: styles.col,
  };

  const classNamesProp = rest.classNames;
  if (
    classNamesProp &&
    typeof classNamesProp === "object" &&
    !Array.isArray(classNamesProp)
  ) {
    const o = classNamesProp as Partial<Record<string, string>>;
    mergedClassNames.col = o.col ? `${styles.col} ${o.col}` : styles.col;
  }

  const classNameProp = rest.className as string | undefined;
  const finalClass = classNameProp
    ? `${styles.col} ${classNameProp}`
    : styles.col;

  return (
    <MantineGrid.Col
      ref={ref}
      className={finalClass}
      classNames={mergedClassNames}
      {...(mapLayoutProps(
        rest as Record<string, unknown>,
      ) as unknown as MantineGridColProps)}
    >
      {children}
    </MantineGrid.Col>
  );
});
_GridCol.displayName = "GridCol";

export const GridCol = createPolymorphicComponent<"div", GridColProps>(
  _GridCol,
);

// ============================================================
// DOT NOTATION EXPORT
// ============================================================

type GridComponent = typeof GridBase & {
  Col: typeof GridCol;
};

export const Grid = GridBase as GridComponent;
Grid.Col = GridCol;

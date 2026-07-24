import { forwardRef } from "react";
import {
  Table as MuiTable,
  type TableProps as MuiTableProps,
  TableBody as MuiTableBody,
  type TableBodyProps as MuiTableBodyProps,
  TableCell as MuiTableCell,
  type TableCellProps as MuiTableCellProps,
  TableContainer as MuiTableContainer,
  type TableContainerProps as MuiTableContainerProps,
  TableHead as MuiTableHead,
  type TableHeadProps as MuiTableHeadProps,
  TableRow as MuiTableRow,
  type TableRowProps as MuiTableRowProps,
  TableFooter as MuiTableFooter,
  type TableFooterProps as MuiTableFooterProps,
  TableSortLabel as MuiTableSortLabel,
  type TableSortLabelProps as MuiTableSortLabelProps,
} from "@mui/material";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import { type RecursicaTableProps } from "@recursica/adapter-common";
import styles from "./Table.module.css";

export type TableProps = RecursicaOverStyled<
  MuiTableProps & RecursicaTableProps
>;

const TableBase = forwardRef<HTMLTableElement, TableProps>(function Table(
  { overStyled = false, ...rest },
  ref,
) {
  const sanitizedProps = filterStylingProps(rest, overStyled);
  const classNameProp = (sanitizedProps as Record<string, unknown>)
    .className as string | undefined;

  const rootClass = styles.root;
  const finalClass = classNameProp
    ? `${rootClass} ${classNameProp}`
    : rootClass;

  return (
    <MuiTable
      ref={ref}
      className={finalClass}
      {...(sanitizedProps as unknown as MuiTableProps)}
    />
  );
});

TableBase.displayName = "Table";

// ==== EXPLICIT DOT-NOTATION SUB-COMPONENTS ====
// Each sub-component is wrapped independently so it goes through
// filterStylingProps/overStyled the same way the root Table does.

export type TableBodyPropsRecursica = RecursicaOverStyled<MuiTableBodyProps>;

export const TableBodyComponent = forwardRef<
  HTMLTableSectionElement,
  TableBodyPropsRecursica
>(function TableBody({ overStyled = false, ...rest }, ref) {
  const sanitizedProps = filterStylingProps(rest, overStyled);
  return (
    <MuiTableBody
      ref={ref}
      {...(sanitizedProps as unknown as MuiTableBodyProps)}
    />
  );
});
TableBodyComponent.displayName = "TableBody";

export type TableCellPropsRecursica = RecursicaOverStyled<MuiTableCellProps>;

export const TableCellComponent = forwardRef<
  HTMLTableCellElement,
  TableCellPropsRecursica
>(function TableCell({ overStyled = false, ...rest }, ref) {
  const sanitizedProps = filterStylingProps(rest, overStyled);
  return (
    <MuiTableCell
      ref={ref}
      {...(sanitizedProps as unknown as MuiTableCellProps)}
    />
  );
});
TableCellComponent.displayName = "TableCell";

export type TableContainerPropsRecursica =
  RecursicaOverStyled<MuiTableContainerProps>;

export const TableContainerComponent = forwardRef<
  HTMLDivElement,
  TableContainerPropsRecursica
>(function TableContainer({ overStyled = false, ...rest }, ref) {
  const sanitizedProps = filterStylingProps(rest, overStyled);
  return (
    <MuiTableContainer
      ref={ref}
      {...(sanitizedProps as unknown as MuiTableContainerProps)}
    />
  );
});
TableContainerComponent.displayName = "TableContainer";

export type TableHeadPropsRecursica = RecursicaOverStyled<MuiTableHeadProps>;

export const TableHeadComponent = forwardRef<
  HTMLTableSectionElement,
  TableHeadPropsRecursica
>(function TableHead({ overStyled = false, ...rest }, ref) {
  const sanitizedProps = filterStylingProps(rest, overStyled);
  return (
    <MuiTableHead
      ref={ref}
      {...(sanitizedProps as unknown as MuiTableHeadProps)}
    />
  );
});
TableHeadComponent.displayName = "TableHead";

export type TableRowPropsRecursica = RecursicaOverStyled<MuiTableRowProps>;

export const TableRowComponent = forwardRef<
  HTMLTableRowElement,
  TableRowPropsRecursica
>(function TableRow({ overStyled = false, ...rest }, ref) {
  const sanitizedProps = filterStylingProps(rest, overStyled);
  return (
    <MuiTableRow
      ref={ref}
      {...(sanitizedProps as unknown as MuiTableRowProps)}
    />
  );
});
TableRowComponent.displayName = "TableRow";

export type TableFooterPropsRecursica =
  RecursicaOverStyled<MuiTableFooterProps>;

export const TableFooterComponent = forwardRef<
  HTMLTableSectionElement,
  TableFooterPropsRecursica
>(function TableFooter({ overStyled = false, ...rest }, ref) {
  const sanitizedProps = filterStylingProps(rest, overStyled);
  return (
    <MuiTableFooter
      ref={ref}
      {...(sanitizedProps as unknown as MuiTableFooterProps)}
    />
  );
});
TableFooterComponent.displayName = "TableFooter";

export type TableSortLabelPropsRecursica =
  RecursicaOverStyled<MuiTableSortLabelProps>;

export const TableSortLabelComponent = forwardRef<
  HTMLSpanElement,
  TableSortLabelPropsRecursica
>(function TableSortLabel({ overStyled = false, ...rest }, ref) {
  const sanitizedProps = filterStylingProps(rest, overStyled);
  return (
    <MuiTableSortLabel
      ref={ref}
      {...(sanitizedProps as unknown as MuiTableSortLabelProps)}
    />
  );
});
TableSortLabelComponent.displayName = "TableSortLabel";

// ==== DOT NOTATION EXPORT ====

type TableComponent = typeof TableBase & {
  Body: typeof TableBodyComponent;
  Cell: typeof TableCellComponent;
  Container: typeof TableContainerComponent;
  Head: typeof TableHeadComponent;
  Row: typeof TableRowComponent;
  Footer: typeof TableFooterComponent;
  SortLabel: typeof TableSortLabelComponent;
};

export const Table = TableBase as TableComponent;
Table.Body = TableBodyComponent;
Table.Cell = TableCellComponent;
Table.Container = TableContainerComponent;
Table.Head = TableHeadComponent;
Table.Row = TableRowComponent;
Table.Footer = TableFooterComponent;
Table.SortLabel = TableSortLabelComponent;

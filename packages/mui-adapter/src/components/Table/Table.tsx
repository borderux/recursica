import { forwardRef } from "react";
import {
  Table as MuiTable,
  type TableProps as MuiTableProps,
  TableBody as MuiTableBody,
  TableCell as MuiTableCell,
  TableContainer as MuiTableContainer,
  TableHead as MuiTableHead,
  TableRow as MuiTableRow,
  TableFooter as MuiTableFooter,
  TableSortLabel as MuiTableSortLabel,
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
  { overStyled = false, className, ...rest },
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

type TableComponent = typeof TableBase & {
  Body: typeof MuiTableBody;
  Cell: typeof MuiTableCell;
  Container: typeof MuiTableContainer;
  Head: typeof MuiTableHead;
  Row: typeof MuiTableRow;
  Footer: typeof MuiTableFooter;
  SortLabel: typeof MuiTableSortLabel;
};

export const Table = TableBase as TableComponent;
Table.Body = MuiTableBody;
Table.Cell = MuiTableCell;
Table.Container = MuiTableContainer;
Table.Head = MuiTableHead;
Table.Row = MuiTableRow;
Table.Footer = MuiTableFooter;
Table.SortLabel = MuiTableSortLabel;

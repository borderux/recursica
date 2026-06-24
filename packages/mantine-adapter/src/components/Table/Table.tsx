import { forwardRef } from "react";
import {
  Table as MantineTable,
  type TableProps as MantineTableProps,
} from "@mantine/core";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import { type RecursicaTableProps } from "@recursica/adapter-common";
import styles from "./Table.module.css";

export type TableProps = RecursicaOverStyled<
  MantineTableProps & RecursicaTableProps
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
    <MantineTable
      ref={ref}
      className={finalClass}
      {...(sanitizedProps as unknown as MantineTableProps)}
    />
  );
});

TableBase.displayName = "Table";

type TableComponent = typeof TableBase & {
  Thead: typeof MantineTable.Thead;
  Tbody: typeof MantineTable.Tbody;
  Tr: typeof MantineTable.Tr;
  Th: typeof MantineTable.Th;
  Td: typeof MantineTable.Td;
  Tfoot: typeof MantineTable.Tfoot;
  Caption: typeof MantineTable.Caption;
  ScrollContainer: typeof MantineTable.ScrollContainer;
};

export const Table = TableBase as TableComponent;
Table.Thead = MantineTable.Thead;
Table.Tbody = MantineTable.Tbody;
Table.Tr = MantineTable.Tr;
Table.Th = MantineTable.Th;
Table.Td = MantineTable.Td;
Table.Tfoot = MantineTable.Tfoot;
Table.Caption = MantineTable.Caption;
Table.ScrollContainer = MantineTable.ScrollContainer;

import { forwardRef } from "react";
import {
  Table as MantineTable,
  type TableProps as MantineTableProps,
  type TableTheadProps as MantineTableTheadProps,
  type TableTbodyProps as MantineTableTbodyProps,
  type TableTrProps as MantineTableTrProps,
  type TableThProps as MantineTableThProps,
  type TableTdProps as MantineTableTdProps,
  type TableTfootProps as MantineTableTfootProps,
  type TableCaptionProps as MantineTableCaptionProps,
  type TableScrollContainerProps as MantineTableScrollContainerProps,
} from "@mantine/core";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import {
  type RecursicaTableProps,
  type RecursicaTableRowProps,
  type RecursicaTableHeaderCellProps,
  type RecursicaTableCellProps,
} from "@recursica/adapter-common";
import styles from "./Table.module.css";
import { ChevronUpIcon, ChevronDownIcon } from "./Table.icons";

export type TableProps = RecursicaOverStyled<
  MantineTableProps & RecursicaTableProps
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
    <MantineTable
      ref={ref}
      {...(sanitizedProps as unknown as MantineTableProps)}
      className={finalClass}
    />
  );
});

TableBase.displayName = "Table";

// ==== EXPLICIT DOT-NOTATION SUB-COMPONENTS ====
// Each sub-component is wrapped independently so it goes through
// filterStylingProps/overStyled the same way the root Table does.

export type TableTheadProps = RecursicaOverStyled<MantineTableTheadProps>;

export const TableThead = forwardRef<HTMLTableSectionElement, TableTheadProps>(
  function TableThead({ overStyled = false, ...rest }, ref) {
    const sanitizedProps = filterStylingProps(rest, overStyled);
    return (
      <MantineTable.Thead
        ref={ref}
        {...(sanitizedProps as unknown as MantineTableTheadProps)}
      />
    );
  },
);
TableThead.displayName = "TableThead";

export type TableTbodyProps = RecursicaOverStyled<MantineTableTbodyProps>;

export const TableTbody = forwardRef<HTMLTableSectionElement, TableTbodyProps>(
  function TableTbody({ overStyled = false, ...rest }, ref) {
    const sanitizedProps = filterStylingProps(rest, overStyled);
    return (
      <MantineTable.Tbody
        ref={ref}
        {...(sanitizedProps as unknown as MantineTableTbodyProps)}
      />
    );
  },
);
TableTbody.displayName = "TableTbody";

export type TableTrProps = RecursicaOverStyled<
  Omit<MantineTableTrProps, "children"> & RecursicaTableRowProps
>;

export const TableTr = forwardRef<HTMLTableRowElement, TableTrProps>(
  function TableTr(
    { overStyled = false, selected = false, disabled = false, ...rest },
    ref,
  ) {
    const sanitizedProps = filterStylingProps(rest, overStyled);
    return (
      <MantineTable.Tr
        ref={ref}
        {...(sanitizedProps as unknown as MantineTableTrProps)}
        data-selected={selected ? "true" : undefined}
        data-disabled={disabled ? "true" : undefined}
      />
    );
  },
);
TableTr.displayName = "TableTr";

export type TableThProps = RecursicaOverStyled<
  Omit<MantineTableThProps, "children"> & RecursicaTableHeaderCellProps
>;

export const TableTh = forwardRef<HTMLTableCellElement, TableThProps>(
  function TableTh(
    { overStyled = false, sorted = false, disabled = false, children, ...rest },
    ref,
  ) {
    const sanitizedProps = filterStylingProps(rest, overStyled);
    return (
      <MantineTable.Th
        ref={ref}
        {...(sanitizedProps as unknown as MantineTableThProps)}
        data-sorted={sorted ? "true" : undefined}
        data-disabled={disabled ? "true" : undefined}
        aria-sort={
          sorted === "asc"
            ? "ascending"
            : sorted === "desc"
              ? "descending"
              : undefined
        }
      >
        {children}
        {sorted === "asc" && <ChevronUpIcon className={styles.sortIcon} />}
        {sorted === "desc" && <ChevronDownIcon className={styles.sortIcon} />}
      </MantineTable.Th>
    );
  },
);
TableTh.displayName = "TableTh";

export type TableTdProps = RecursicaOverStyled<
  Omit<MantineTableTdProps, "children"> & RecursicaTableCellProps
>;

export const TableTd = forwardRef<HTMLTableCellElement, TableTdProps>(
  function TableTd(
    { overStyled = false, disabled = false, variant = "default", ...rest },
    ref,
  ) {
    const sanitizedProps = filterStylingProps(rest, overStyled);
    return (
      <MantineTable.Td
        ref={ref}
        {...(sanitizedProps as unknown as MantineTableTdProps)}
        data-disabled={disabled ? "true" : undefined}
        data-currency={variant === "currency" ? "true" : undefined}
      />
    );
  },
);
TableTd.displayName = "TableTd";

export type TableTfootProps = RecursicaOverStyled<MantineTableTfootProps>;

export const TableTfoot = forwardRef<HTMLTableSectionElement, TableTfootProps>(
  function TableTfoot({ overStyled = false, ...rest }, ref) {
    const sanitizedProps = filterStylingProps(rest, overStyled);
    return (
      <MantineTable.Tfoot
        ref={ref}
        {...(sanitizedProps as unknown as MantineTableTfootProps)}
      />
    );
  },
);
TableTfoot.displayName = "TableTfoot";

export type TableCaptionProps = RecursicaOverStyled<MantineTableCaptionProps>;

export const TableCaption = forwardRef<
  HTMLTableCaptionElement,
  TableCaptionProps
>(function TableCaption({ overStyled = false, ...rest }, ref) {
  const sanitizedProps = filterStylingProps(rest, overStyled);
  return (
    <MantineTable.Caption
      ref={ref}
      {...(sanitizedProps as unknown as MantineTableCaptionProps)}
    />
  );
});
TableCaption.displayName = "TableCaption";

export type TableScrollContainerProps =
  RecursicaOverStyled<MantineTableScrollContainerProps>;

export const TableScrollContainer = forwardRef<
  HTMLDivElement,
  TableScrollContainerProps
>(function TableScrollContainer({ overStyled = false, ...rest }, ref) {
  const sanitizedProps = filterStylingProps(rest, overStyled);
  return (
    <MantineTable.ScrollContainer
      ref={ref}
      {...(sanitizedProps as unknown as MantineTableScrollContainerProps)}
    />
  );
});
TableScrollContainer.displayName = "TableScrollContainer";

// ==== DOT NOTATION EXPORT ====

type TableComponent = typeof TableBase & {
  Thead: typeof TableThead;
  Tbody: typeof TableTbody;
  Tr: typeof TableTr;
  Th: typeof TableTh;
  Td: typeof TableTd;
  Tfoot: typeof TableTfoot;
  Caption: typeof TableCaption;
  ScrollContainer: typeof TableScrollContainer;
};

export const Table = TableBase as TableComponent;
Table.Thead = TableThead;
Table.Tbody = TableTbody;
Table.Tr = TableTr;
Table.Th = TableTh;
Table.Td = TableTd;
Table.Tfoot = TableTfoot;
Table.Caption = TableCaption;
Table.ScrollContainer = TableScrollContainer;

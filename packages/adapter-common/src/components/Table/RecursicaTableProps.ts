import React from "react";

/**
 * Props for the Recursica Table component.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface RecursicaTableProps {}

/**
 * Props for the Recursica Table row component (`Table.Tr` / `Table.Row`).
 */
export interface RecursicaTableRowProps {
  /** The row's cells */
  children?: React.ReactNode;
  /** Marks the row as selected, applying the selected-row background */
  selected?: boolean;
  /** Disables the row, dimming it and applying the disabled cell colors to every cell in it */
  disabled?: boolean;
}

/**
 * Props for the Recursica Table header cell component (`Table.Th`).
 */
export interface RecursicaTableHeaderCellProps {
  /** The header cell's label content */
  children?: React.ReactNode;
  /**
   * Current sort direction for this column. `false` (default) renders the unsorted style with
   * no icon; `"asc"`/`"desc"` render the sorted style and the matching chevron icon.
   */
  sorted?: "asc" | "desc" | false;
  /** Disables the header cell, dimming it and applying the disabled cell colors */
  disabled?: boolean;
  /** `"currency"` right-aligns the header cell to match a currency column's value cells */
  variant?: "default" | "currency";
}

/**
 * Props for the Recursica Table cell component (`Table.Td` / `Table.Cell`).
 */
export interface RecursicaTableCellProps {
  /** The cell's content */
  children?: React.ReactNode;
  /** Disables the cell, dimming it and applying the disabled cell colors */
  disabled?: boolean;
  /** `"currency"` applies the currency text style (used for numeric/monetary columns) */
  variant?: "default" | "currency";
}

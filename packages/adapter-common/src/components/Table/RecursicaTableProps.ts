import React from "react";

/**
 * Props for the Recursica Table component.
 *
 * Forge mapping (names in `recursica_ui-kit.json` / `--recursica_ui-kit_components_<contract>_*`):
 * - Contract `table`. Forge's `table-cell`, `table-header` and `table-footer` are children of the Table here (`Table.Td`, `Table.Th`, `Table.Tfoot`), and each has axis `states` disabled ← `disabled`.
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
 *
 * Forge mapping (names in `recursica_ui-kit.json` / `--recursica_ui-kit_components_<contract>_*`):
 * - Forge contract `table-header`. `states` disabled ← `disabled`. `variant` is not a Forge axis.
 */
export interface RecursicaTableHeaderCellProps {
  /** The header cell's label content */
  children?: React.ReactNode;
  /**
   * Current sort direction for this column. `false` (default) renders the unsorted style with
   * no icon; `"asc"`/`"desc"` render the sorted style and the matching chevron icon.
   */
  sorted?: "asc" | "desc" | false;
  /**
   * Disables the header cell, dimming it and applying the disabled cell colors
   *
   * Forge axis `states`: disabled.
   */
  disabled?: boolean;
  /**
   * `"currency"` right-aligns the header cell to match a currency column's value cells
   *
   * Not a Forge axis.
   */
  variant?: "default" | "currency" | (string & {});
}

/**
 * Props for the Recursica Table cell component (`Table.Td` / `Table.Cell`).
 *
 * Forge mapping (names in `recursica_ui-kit.json` / `--recursica_ui-kit_components_<contract>_*`):
 * - Forge contract `table-cell`. `states` disabled ← `disabled`. `variant` is not a Forge axis.
 */
export interface RecursicaTableCellProps {
  /** The cell's content */
  children?: React.ReactNode;
  /**
   * Disables the cell, dimming it and applying the disabled cell colors
   *
   * Forge axis `states`: disabled.
   */
  disabled?: boolean;
  /**
   * `"currency"` applies the currency text style (used for numeric/monetary columns)
   *
   * Not a Forge axis.
   */
  variant?: "default" | "currency" | (string & {});
}

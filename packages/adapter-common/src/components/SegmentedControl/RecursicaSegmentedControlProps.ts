import React from "react";

/**
 * Props for the Recursica SegmentedControl component.
 *
 * Forge mapping (names in `recursica_ui-kit.json` / `--recursica_ui-kit_components_<contract>_*`):
 * - Contract `segmented-control`. Axes: `orientation` ← `orientation`; `fill-width` (false, true) ← `fullWidth`.
 * - Forge's `segmented-control-item` contract is each entry of `data`. It adds `selection-states` (selected, unselected, derived from `value`) and per-item disabled.
 */
export interface RecursicaSegmentedControlProps {
  /**
   * The orientation layout direction of the control buttons
   *
   * Forge axis `orientation`.
   */
  orientation?: "horizontal" | "vertical";
  /**
   * If true, the control will stretch full-width
   *
   * Forge axis `fill-width`.
   */
  fullWidth?: boolean;
  /** Disables every item in the control at once; a single item can still be disabled via `data` */
  disabled?: boolean;
  /** Data configuration options array */
  data?: Array<
    | string
    | {
        label: React.ReactNode;
        value: string;
        disabled?: boolean;
        /** Optional leading icon rendered alongside the item's label */
        icon?: React.ReactNode;
      }
  >;
  /** Active selected item value key */
  value?: string;
  // `onChange` is intentionally not declared here. Each adapter picks it up straight from its
  // own underlying kit, signature and all, so a Recursica component drops in over an existing
  // implementation with no caller changes.
}

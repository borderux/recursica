import React from "react";

/**
 * Props for the Recursica SegmentedControl component.
 */
export interface RecursicaSegmentedControlProps {
  /** The orientation layout direction of the control buttons */
  orientation?: "horizontal" | "vertical";
  /** If true, the control will stretch full-width */
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
  // own underlying kit (Mantine's SegmentedControl vs MUI's ToggleButtonGroup), signature and
  // all, so a Recursica component drops in over an existing implementation with no caller changes.
}

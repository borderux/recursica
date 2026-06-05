import React from "react";

/**
 * Props for the Recursica SegmentedControl component.
 */
export interface RecursicaSegmentedControlProps {
  /** The orientation layout direction of the control buttons */
  orientation?: "horizontal" | "vertical";
  /** If true, the control will stretch full-width */
  fullWidth?: boolean;
  /** SegmentedControl explicitly forbids disabled prop */
  disabled?: never;
  /** Data configuration options array */
  data?: Array<
    string | { label: React.ReactNode; value: string; disabled?: boolean }
  >;
  /** Active selected item value key */
  value?: string;
  /** Callback triggered when selected item changes */
  onChange?: (value: string) => void;
}

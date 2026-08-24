import React from "react";

/**
 * Props for the Recursica Chip component.
 */
export interface RecursicaChipProps {
  /** Enables the error state styling */
  error?: boolean;
  /** Leading icon content */
  icon?: React.ReactNode;
  /** Called when the remove (X) icon is clicked. If provided, the remove icon will be displayed. */
  onDelete?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  /** Screen reader label for the remove button. Defaults to 'Remove' */
  removeLabel?: string;
  /** Checked state for the chip (acts as a checkbox) */
  checked?: boolean;
  /**
   * Tab index for the remove (X) icon. Defaults to `0`. Lets a parent implement a roving-tabindex
   * pattern across a group of chips (e.g. FileUpload's file list) by setting this to `-1` on every
   * chip except the currently-active one.
   */
  removeTabIndex?: number;
  /**
   * Ref to the remove (X) icon element, so a parent can move focus to it imperatively — e.g.
   * arrow-key navigation across a group of chips.
   */
  removeIconRef?: React.Ref<HTMLSpanElement>;
}

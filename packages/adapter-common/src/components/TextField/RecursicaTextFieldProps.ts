import React from "react";

/**
 * Props for the Recursica TextField component.
 */
export interface RecursicaTextFieldProps {
  /**
   * Section rendered inside input on the left (e.g. icon).
   * Not renamed to Forge's `leadingIcon`: deliberately reuses Mantine's own native name;
   * MUI's own (`startAdornment`) is more implementation-specific and isn't icon-only either.
   */
  leftSection?: React.ReactNode;
  /** Section rendered inside input on the right (e.g. clear button). Same naming rationale as `leftSection` above. */
  rightSection?: React.ReactNode;
}

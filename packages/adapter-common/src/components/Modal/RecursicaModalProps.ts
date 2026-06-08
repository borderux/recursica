import React from "react";

/**
 * Props for the Recursica Modal component.
 */
export interface RecursicaModalProps {
  /** Control visibility state */
  opened?: boolean;
  /** Render standard top-right close cross button */
  withCloseButton?: boolean;
  /** Modal header title label */
  title?: React.ReactNode;
}

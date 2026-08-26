import React from "react";

/**
 * Props for the Recursica Menu component.
 */
export interface RecursicaMenuProps {
  /**
   * Overrides the dropdown's token-driven max-height with an explicit pixel (or other CSS
   * length) value. Escape hatch for callers that need an arbitrary menu height the design
   * tokens don't express; leave unset to use the token default.
   */
  maxHeight?: React.CSSProperties["maxHeight"];
}

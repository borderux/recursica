import React from "react";

/**
 * Props for the Recursica AssistiveElement component.
 */
export interface RecursicaAssistiveElementProps {
  /** The helper or error text content */
  children?: React.ReactNode;
  /** The semantic variant driving the icon and text colors. `"error"` also defaults the
   * element's `role` to `"alert"` so assistive tech announces it as it appears or changes —
   * pass an explicit `role` to override. */
  assistiveVariant?: "help" | "error";
  /** Explicitly toggle the rendering of the variant-specific SVG icon. There is no slot for a
   * custom icon — the icon is always the fixed one belonging to the current `assistiveVariant`. */
  assistiveWithIcon?: boolean;
}

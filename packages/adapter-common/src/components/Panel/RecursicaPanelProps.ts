import React from "react";

/**
 * Props for the Recursica Panel component.
 *
 * Header contract (every adapter): a Panel always has a header with a title and a Close button.
 * The Close button is an icon-only Recursica button, `aria-label` "Close" unless
 * `closeButtonAriaLabel` is passed, and it calls `onClose`. The footer is optional.
 */
export interface RecursicaPanelProps {
  /** Header title. Required. */
  title: React.ReactNode;
  /** Called when the Close button is pressed or Escape is pressed. Required: a Panel always has a Close button. */
  onClose: () => void;
  /** Accessible name of the Close button, for localization. Defaults to "Close". */
  closeButtonAriaLabel?: string;
  /**
   * Replaces the entire default header (title and Close button).
   *
   * Discouraged. The default header enforces the Recursica header contract (required title,
   * always-present Close button, token-driven layout). A custom header must supply its own Close
   * button and title, and the adapter can no longer guarantee either. Prefer the default header.
   */
  header?: React.ReactNode;
  /** Forces header text onto a single line truncating overflow with ellipsis.  Default is true */
  wrapHeaderText?: boolean;
  /**
   * Direction the panel slides out from.
   * Named `placement`, not `position`: `position` is a global `BlockedStylingKeys` entry, so
   * it's typed `never` and stripped unless `overStyled: true`.
   */
  placement?: "top" | "bottom" | "left" | "right";
  /** Control visibility state */
  opened?: boolean;
}

import React from "react";

/**
 * Props for the Recursica Modal component.
 *
 * Header contract (every adapter): a Modal always has a header with a title and a Close button.
 * The Close button is an icon-only Recursica button, `aria-label` "Close" unless
 * `closeButtonAriaLabel` is passed, and it calls `onClose`. The footer is optional.
 *
 * Forge mapping (names in `recursica_ui-kit.json` / `--recursica_ui-kit_components_<contract>_*`):
 * - Contract `modal` (no variants).
 */
export interface RecursicaModalProps {
  /** Control visibility state */
  opened?: boolean;
  /** Modal header title label. Required. */
  title: React.ReactNode;
  /** Called when the Close button is pressed or Escape is pressed. Required: a Modal always has a Close button. */
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
}

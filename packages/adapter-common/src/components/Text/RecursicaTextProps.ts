import React from "react";

/**
 * Supported typographical layout variants in Recursica.
 */
export type TextVariant =
  | "body"
  | "body-small"
  | "caption"
  | "overline"
  | "subtitle"
  | "subtitle-small";

/**
 * Text emphasis level. Controls the text's opacity (not its color):
 * `high` is fully opaque, `low` is slightly dimmed. Only applies when no
 * `state` is set — `state` takes precedence and always renders at full opacity.
 */
export type TextEmphasis = "low" | "high";

/**
 * Semantic text state. Sets the text color to the matching core-color tone.
 * When set, it takes precedence over `emphasis` (the text renders at full opacity).
 */
export type TextState = "alert" | "success" | "warning";

/**
 * Props for the Recursica Text component.
 */
export interface RecursicaTextProps {
  /** Visual style variant layout */
  variant?: TextVariant;
  /**
   * Text opacity level. Defaults to `high` (fully opaque). `low` dims the text
   * without changing its color. Only applies when no `state` is set — `state` wins.
   * @defaultValue "high"
   */
  emphasis?: TextEmphasis;
  /**
   * Semantic text color. Optional — when unset the text inherits the surrounding
   * layer's text color. Takes precedence over `emphasis` (stateful text is full opacity).
   */
  state?: TextState;
  /** Children nodes */
  children?: React.ReactNode;
  /** Polymorphic component tag override */
  component?: React.ElementType;
}

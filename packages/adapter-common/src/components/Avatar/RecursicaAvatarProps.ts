import React from "react";

/**
 * Props for the Recursica Avatar component.
 */
export interface RecursicaAvatarProps {
  /** Initials or other text fallback, shown when neither `src` nor `icon` is set */
  children?: React.ReactNode;
  /** Size of the avatar */
  size?: "small" | "default" | "large";
  /** Visual variant style */
  variant?: "solid" | "outline" | "ghost";
  /** Icon element fallback when initials or src aren't shown */
  icon?: React.ReactNode;
}

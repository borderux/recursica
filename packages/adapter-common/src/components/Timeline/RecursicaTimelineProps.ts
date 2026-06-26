import React from "react";

/**
 * Props for the Recursica Timeline component.
 */
export interface RecursicaTimelineProps {
  /** The timeline items or elements to render */
  children?: React.ReactNode;
  /** Active timeline item index dynamically highlighting progress */
  active?: number;
}

/**
 * Props for the Recursica TimelineItem sub-component.
 */
export interface RecursicaTimelineItemProps {
  /** Timestamp content node */
  timestamp?: React.ReactNode;
  /** Stylistic bullet marker indicator */
  bulletVariant?: "default" | "avatar" | "icon" | "icon-alternative";
  /** Custom element to render inside the bullet circle */
  bullet?: React.ReactNode;
}

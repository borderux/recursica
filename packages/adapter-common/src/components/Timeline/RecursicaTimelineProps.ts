import React from "react";

/**
 * Props for the Recursica Timeline component.
 *
 * Forge mapping (names in `recursica_ui-kit.json` / `--recursica_ui-kit_components_<contract>_*`):
 * - Contract `timeline`. Axis `selection-states` (active, inactive) is derived from `active`, not a prop.
 */
export interface RecursicaTimelineProps {
  /** The timeline items or elements to render */
  children?: React.ReactNode;
  /** Active timeline item index dynamically highlighting progress */
  active?: number;
}

/**
 * Props for the Recursica TimelineItem sub-component.
 *
 * Forge mapping (names in `recursica_ui-kit.json` / `--recursica_ui-kit_components_<contract>_*`):
 * - Forge contract `timeline-bullet` is the bullet of this item. Axes: `types` ← `bulletVariant` (default, icon, icon-alternative, avatar); `selection-states` (active, inactive) is derived from the parent's `active`, not a prop.
 */
export interface RecursicaTimelineItemProps {
  /** Timestamp content node */
  timestamp?: React.ReactNode;
  /**
   * Stylistic bullet marker indicator
   *
   * Forge axis `types` (default, icon, icon-alternative, avatar).
   */
  bulletVariant?:
    | "default"
    | "avatar"
    | "icon"
    | "icon-alternative"
    | (string & {});
  /** Custom element to render inside the bullet circle */
  bullet?: React.ReactNode;
}

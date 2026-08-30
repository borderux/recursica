import React from "react";

/**
 * Props for the Recursica Accordion container component.
 */
export interface RecursicaAccordionProps {
  /** The `Accordion.Item` elements that make up the accordion */
  children?: React.ReactNode;
  /**
   * The styling variant of the accordion. `"default"` is the only variant with dedicated
   * Recursica styling today; any other string is accepted for advanced/custom theming but
   * has no guaranteed styling.
   */
  variant?: "default" | (string & {});
  /** Current expanded value(s) in controlled mode */
  value?: string | string[];
  /** Initial expanded value(s) in uncontrolled mode */
  defaultValue?: string | string[];
  // `onChange` is intentionally not declared here. mantine-adapter picks it up straight from
  // Mantine's own native Accordion (identical signature already). mui-adapter has no native
  // multi-panel accordion group to match — MUI's own `Accordion` is single-item — so it declares
  // this signature itself, same as TransferList; see mui-adapter's `Accordion.tsx`.
  /** Allow multiple panels to be open simultaneously */
  multiple?: boolean;
  /** Custom chevron icon to replace the default expand/collapse indicator. Applies to every
   * item; a single item's control can still override it individually. */
  chevron?: React.ReactNode;
}

/**
 * Props for the Recursica Accordion Item component.
 */
export interface RecursicaAccordionItemProps {
  /**
   * When `title` is set, this is the panel content — the control and panel are constructed
   * automatically, with `children` becoming the panel body. When `title` is omitted, this is
   * expected to be a manually composed `Accordion.Control`/`Accordion.Panel` pair instead.
   */
  children?: React.ReactNode;
  /** The text or element label for the item control. When set, the control and panel are
   * constructed automatically; omit it to compose the control and panel manually instead. */
  title?: React.ReactNode;
  /** Leading icon for the item control */
  leftIcon?: React.ReactNode;
  /** Toggle visibility of the divider below the item */
  divider?: boolean;
  /** Unique value identifier for this item. Required — omitting it on multiple items collapses
   * them to the same identity and they toggle together (see beam-adapter's
   * docs/OPEN_DECISIONS.md #23b). Was optional in the type until 2026-08-29 even though every
   * real consumer already supplied it. */
  value: string;
  /** Disables interaction with this item — it can't be expanded or collapsed, and is dimmed */
  disabled?: boolean;
}

/**
 * Props for the Recursica Accordion Control component.
 */
export interface RecursicaAccordionControlProps {
  /** The control's label content */
  children?: React.ReactNode;
  /** Leading icon displayed inside the control boundary */
  leftIcon?: React.ReactNode;
}

/**
 * Props for the Recursica Accordion Panel component.
 */
export interface RecursicaAccordionPanelProps {
  /** The panel's content, shown when the item is expanded */
  children?: React.ReactNode;
}

import React from "react";

/**
 * Props for the Recursica Accordion container component.
 */
export interface RecursicaAccordionProps {
  /** The styling variant of the accordion */
  variant?: string;
  /** Current expanded value(s) in controlled mode */
  value?: string | string[];
  /** Initial expanded value(s) in uncontrolled mode */
  defaultValue?: string | string[];
  /** Callback triggered when value changes */
  onChange?: (value: string | string[] | null) => void;
  /** Allow multiple panels to be open simultaneously */
  multiple?: boolean;
}

/**
 * Props for the Recursica Accordion Item component.
 */
export interface RecursicaAccordionItemProps {
  /** The text or element label for the item control */
  title?: React.ReactNode;
  /** Leading icon for the item control */
  leftIcon?: React.ReactNode;
  /** Toggle visibility of the divider below the item */
  divider?: boolean;
  /** Unique value identifier for this item */
  value?: string;
}

/**
 * Props for the Recursica Accordion Control component.
 */
export interface RecursicaAccordionControlProps {
  /** Leading icon displayed inside the control boundary */
  leftIcon?: React.ReactNode;
}

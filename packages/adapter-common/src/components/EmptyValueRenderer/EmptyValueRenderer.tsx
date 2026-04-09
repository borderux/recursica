/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

export interface EmptyValueRendererProps {
  /** The empty value that tripped the check, provided for potential custom rendering logic hooks */
  value?: any;
  /** Custom fallback text applied dynamically replacing standard 'N/A' defaults strings explicitly */
  emptyText?: string;
}

/**
 * Renders default visual fallbacks for Empty Values in ReadOnly contexts.
 */
export const EmptyValueRenderer: React.FC<EmptyValueRendererProps> & {
  check: (value: any) => boolean;
} = ({ emptyText = "N/A" }) => {
  return <React.Fragment>{emptyText}</React.Fragment>;
};

EmptyValueRenderer.displayName = "EmptyValueRenderer";

/**
 * Evaluates whether a generic value is considered 'Empty' natively across the system (null, undefined, "", or []).
 * Attached statically to the component allowing overriding configurations to utilize native logic dynamically.
 */
EmptyValueRenderer.check = (value: any): boolean => {
  return (
    value == null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  );
};

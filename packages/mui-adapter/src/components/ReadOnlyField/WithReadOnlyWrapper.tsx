/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { forwardRef } from "react";
import { type ReadOnlyFieldType } from "@recursica/adapter-common";
import {
  FormControlWrapper,
  type FormControlWrapperProps,
} from "../FormControlWrapper/FormControlWrapper";
import { ReadOnlyField } from "./ReadOnlyField";

export interface WithReadOnlyWrapperProps
  extends Omit<FormControlWrapperProps, "children" | "overStyled"> {
  /** Injects whether the field defaults to reading mode natively */
  readOnly?: boolean;
  /** Explicit React component directly overtaking the baseline text renderer when read-only mode is active */
  readOnlyComponent?: React.ElementType<any>;
  /** Custom renderer explicitly responsible for formatting missing/empty value mappings (overriding default 'N/A') */
  emptyValueComponent?: React.ElementType<{ value?: any }>;
  /** The full native props dictionary securely forwarded into the custom readOnlyComponent if active */
  readOnlyNativeProps?: any;
  /** Instructs the underlying generic ReadOnlyField which raw visual structure to bridge automatically */
  readOnlyType?: ReadOnlyFieldType;
  /** The isolated raw data value intercepted explicitly into the ReadOnly formatters */
  readOnlyValue?: any;
  /** Safely enables deep overrides transparently bypassing block filters */
  overStyled?: boolean;
  /** The nested active node dynamically exposed exclusively when read-only bounds are disabled */
  activeComponent: React.ReactNode;
}

/**
 * Universal execution barrier trapping readOnly states globally.
 * Natively delegates active logic down avoiding duplicative internal component bindings dynamically.
 */
export const WithReadOnlyWrapper = forwardRef<
  HTMLDivElement,
  WithReadOnlyWrapperProps
>(function WithReadOnlyWrapper(
  {
    readOnly,
    readOnlyComponent,
    readOnlyType = "text",
    readOnlyValue,
    readOnlyNativeProps,
    emptyValueComponent,
    activeComponent,
    overStyled,
    onLabelEditClick,
    ...wrapperProps
  },
  ref,
) {
  if (readOnly) {
    if (readOnlyComponent) {
      const ReadOnlyComponent = readOnlyComponent;
      return (
        <FormControlWrapper
          ref={ref}
          {...wrapperProps}
          onLabelEditClick={onLabelEditClick}
          overStyled={overStyled as true}
        >
          <ReadOnlyComponent {...readOnlyNativeProps} />
        </FormControlWrapper>
      );
    }

    return (
      <ReadOnlyField
        ref={ref}
        type={readOnlyType}
        value={readOnlyValue}
        emptyValueComponent={emptyValueComponent}
        onLabelEditClick={onLabelEditClick}
        overStyled={overStyled as true}
        {...wrapperProps}
      />
    );
  }

  // Active Standard Execution natively forwarding bound children implicitly
  return (
    <FormControlWrapper
      ref={ref}
      {...wrapperProps}
      onLabelEditClick={onLabelEditClick}
      overStyled={overStyled as true}
    >
      {activeComponent}
    </FormControlWrapper>
  );
});

WithReadOnlyWrapper.displayName = "WithReadOnlyWrapper";

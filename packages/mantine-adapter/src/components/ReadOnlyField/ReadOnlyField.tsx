/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { forwardRef } from "react";
import {
  ReadOnlyFieldType,
  EmptyValueRenderer,
} from "@recursica/adapter-common";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import {
  type FormControlWrapperProps,
  FormControlWrapper,
} from "../FormControlWrapper/FormControlWrapper";
import { ReadOnlyTextField } from "./ReadOnlyTextField";

export interface RecursicaReadOnlyFieldProps
  extends Omit<FormControlWrapperProps, "children" | "overStyled"> {
  /** The specific value to be rendered in read-only mode explicitly matching the original field input */
  value?: any;
  /** The data type formatting rules bounding how the string is presented to the user */
  type?: ReadOnlyFieldType;
  /** Custom renderer explicitly responsible for formatting missing/empty value mappings (overriding default 'N/A') */
  emptyValueComponent?: React.ElementType<{ value?: any }>;
}

export type ReadOnlyFieldProps =
  RecursicaOverStyled<RecursicaReadOnlyFieldProps>;

/**
 * A native generic form control wrapper exclusively responsible for displaying fixed data.
 * Internally maps to structural ReadOnly primitive blocks bridging standard `FormControlWrapper` layouts natively.
 */
export const ReadOnlyField = forwardRef<HTMLDivElement, ReadOnlyFieldProps>(
  function ReadOnlyField(
    { value, type = "text", emptyValueComponent, overStyled = false, ...rest },
    ref,
  ) {
    let content: React.ReactNode = null;

    // We still pass sanitized properties (like className/style/etc) strictly down.
    const sanitizedProps = filterStylingProps(rest, overStyled);

    const Renderer = emptyValueComponent || EmptyValueRenderer;
    const isValueEmpty = (Renderer as any).check
      ? (Renderer as any).check(value)
      : EmptyValueRenderer.check(value);

    const displayValue = isValueEmpty ? <Renderer value={value} /> : value;

    switch (type) {
      case "text":
      default:
        content = (
          <ReadOnlyTextField
            value={displayValue}
            overStyled={overStyled as true}
          />
        );
        break;
    }

    return (
      <FormControlWrapper
        ref={ref}
        overStyled={overStyled as true}
        {...(sanitizedProps as any)}
      >
        {content}
      </FormControlWrapper>
    );
  },
);

ReadOnlyField.displayName = "ReadOnlyField";

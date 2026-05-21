/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { forwardRef } from "react";
import {
  ReadOnlyFieldType,
  EmptyValueRenderer,
  type ReadOnlyControlProps,
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
import styles from "./ReadOnlyField.module.css";

export interface RecursicaReadOnlyFieldProps
  extends Omit<
      FormControlWrapperProps,
      "children" | "overStyled" | "controlMaxWidth" | "controlMinWidth"
    >,
    Pick<ReadOnlyControlProps, "emptyValueComponent"> {
  /** The specific value to be rendered in read-only mode explicitly matching the original field input */
  value?: any;
  /** The data type formatting rules bounding how the string is presented to the user */
  type?: ReadOnlyFieldType;
  /** Pass the native maximum width design variable dynamically bounding the specific wrapper width exclusively. */
  controlMaxWidth?: string | undefined;
  /** Pass the native minimum width design variable dynamically bounding the specific wrapper width exclusively. */
  controlMinWidth?: string | undefined;
}

export type ReadOnlyFieldProps =
  RecursicaOverStyled<RecursicaReadOnlyFieldProps>;

/**
 * A native generic form control wrapper exclusively responsible for displaying fixed data.
 * Internally maps to structural ReadOnly primitive blocks bridging standard `FormControlWrapper` layouts natively.
 */
export const ReadOnlyField = forwardRef<HTMLDivElement, ReadOnlyFieldProps>(
  function ReadOnlyField(
    {
      value,
      type = "text",
      emptyValueComponent,
      overStyled = false,
      className,
      style,
      ...rest
    },
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
      case "boolean":
        content = (
          <ReadOnlyTextField
            value={
              value === true ? "True" : value === false ? "False" : displayValue
            }
            overStyled={overStyled as true}
          />
        );
        break;
      case "switch":
        content = (
          <ReadOnlyTextField
            value={
              value === true ? "On" : value === false ? "Off" : displayValue
            }
            overStyled={overStyled as true}
          />
        );
        break;
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

    const wrapperClass = className
      ? `${styles.layoutOverride} ${className}`
      : styles.layoutOverride;

    return (
      <FormControlWrapper
        ref={ref}
        overStyled={overStyled as true}
        className={wrapperClass}
        style={style}
        {...(sanitizedProps as any)}
      >
        {content}
      </FormControlWrapper>
    );
  },
);

ReadOnlyField.displayName = "ReadOnlyField";

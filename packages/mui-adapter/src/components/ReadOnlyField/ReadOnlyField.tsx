/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { type ReadOnlyControlProps } from "@recursica/adapter-common";
import {
  FormControlWrapper,
  type RecursicaFormControlWrapperProps,
} from "../FormControlWrapper/FormControlWrapper";
import styles from "./ReadOnlyField.module.css";

export type ReadOnlyFieldProps = Omit<
  RecursicaFormControlWrapperProps,
  "error" | "focused"
> &
  ReadOnlyControlProps & {
    value?: any;
    type?: "text" | "boolean" | "number" | "switch" | "date";
  };

export const ReadOnlyField = React.forwardRef<
  HTMLDivElement,
  ReadOnlyFieldProps
>(function ReadOnlyField(props, ref) {
  const {
    value,
    type = "text",
    readOnlyComponent,
    emptyValueComponent,
    className,
    ...wrapperProps
  } = props;

  // Custom empty component bypass map handling dynamically explicitly
  if (emptyValueComponent && typeof emptyValueComponent !== "string") {
    const CustomEmptyRenderer = emptyValueComponent as React.FC<any> & {
      check?: (val: any) => boolean;
    };
    if (CustomEmptyRenderer.check && CustomEmptyRenderer.check(value)) {
      return (
        <FormControlWrapper
          ref={ref}
          className={`${styles.root} ${className || ""}`}
          {...wrapperProps}
        >
          <CustomEmptyRenderer value={value} />
        </FormControlWrapper>
      );
    }
  }

  // Value missing check mapping Default 'N/A' behavior mapping natively
  const isMissing =
    value === undefined ||
    value === null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0);

  if (isMissing) {
    return (
      <FormControlWrapper
        ref={ref}
        className={`${styles.root} ${className || ""}`}
        {...wrapperProps}
      >
        <p className={styles.text}>N/A</p>
      </FormControlWrapper>
    );
  }

  // Override execution mapping securely
  if (readOnlyComponent) {
    const CustomReadOnlyRenderer = readOnlyComponent as React.ElementType;
    return (
      <FormControlWrapper
        ref={ref}
        className={`${styles.root} ${className || ""}`}
        {...wrapperProps}
      >
        <CustomReadOnlyRenderer value={value as any} />
      </FormControlWrapper>
    );
  }

  // Type coercions securely bounding the output values cleanly explicitly.
  let displayValue: React.ReactNode = value;

  if (type === "boolean" || type === "switch") {
    displayValue = value ? "True" : "False";
    if (type === "switch") {
      displayValue = value ? "On" : "Off";
    }
  } else if (Array.isArray(value)) {
    displayValue = value.join(", ");
  } else {
    displayValue = String(value);
  }

  return (
    <FormControlWrapper
      ref={ref}
      className={`${styles.root} ${className || ""}`}
      {...wrapperProps}
    >
      <p className={styles.text}>{displayValue}</p>
    </FormControlWrapper>
  );
});

ReadOnlyField.displayName = "ReadOnlyField";

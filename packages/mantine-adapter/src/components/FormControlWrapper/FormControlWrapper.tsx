import React, { forwardRef, useId } from "react";
import { type InputWrapperProps, Box } from "@mantine/core";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import { Label, type RecursicaLabelProps } from "../Label/Label";
import { AssistiveElement } from "../AssistiveElement/AssistiveElement";
import styles from "./FormControlWrapper.module.css";

export interface RecursicaFormControlWrapperProps extends RecursicaLabelProps {
  /** Securely replaces standard Mantine descriptions safely providing standard Assistive properties. */
  assistiveText?: React.ReactNode;
  /** Explicit toggle to suppress the Info icon rendering natively alongside the assistiveText. Defaults to true. */
  assistiveWithIcon?: boolean;
  /** Custom action area to render alongside the label instead of the default edit icon. */
  labelActionArea?: React.ReactNode;
  /** Pass the native maximum width design variable dynamically bounding the specific wrapper width exclusively. */
  controlMaxWidth: string | undefined;
  /** Pass the native minimum width design variable dynamically bounding the specific wrapper width exclusively. */
  controlMinWidth: string | undefined;
}

export type FormControlWrapperProps = RecursicaOverStyled<
  Omit<InputWrapperProps, "labelProps" | "inputWrapperOrder"> &
    RecursicaFormControlWrapperProps
>;

export const FormControlWrapper = forwardRef<
  HTMLDivElement,
  FormControlWrapperProps
>(function FormControlWrapper(
  {
    formLayout,
    labelSize,
    labelAlignment,
    labelOptionalText,
    labelWithEditIcon,
    labelActionArea,
    onLabelEditClick,

    label,
    description,
    assistiveText,
    assistiveWithIcon = true,
    controlMaxWidth,
    controlMinWidth,
    error,
    required,
    withAsterisk,
    id: userProvidedId,
    children,
    className,
    overStyled = false,
    labelElement, // Extracted safely preventing bleeding into HTML domains
    ...rest
  },
  ref,
) {
  // Generate a reliable ID to map the Label's HTML context down to the component array natively.
  const generatedId = useId();
  const id = userProvidedId || `recursica-fc-${generatedId}`;

  // Evaluate explicit assistive fallbacks ensuring assistiveText correctly prioritizes natively over underlying Mantine configurations!
  const resolvedAssistive = assistiveText || description;
  const assistiveId = resolvedAssistive ? `${id}-assistive` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  const sanitizedProps = filterStylingProps(rest, overStyled);
  const restRecord = sanitizedProps as Record<string, unknown>;

  const classNameProp =
    className || (restRecord.className as string | undefined);
  const rootClass = styles.root;
  const finalClass = classNameProp
    ? `${rootClass} ${classNameProp}`
    : rootClass;

  // Clone ARIA identifiers directly back down into the nested children wrapper so screen-readers natively hook the external strings
  const content = React.isValidElement(children)
    ? React.cloneElement(
        children as React.ReactElement<Record<string, unknown>>,
        {
          ...(resolvedAssistive &&
          !(children.props as Record<string, unknown>)["aria-describedby"]
            ? { "aria-describedby": assistiveId }
            : {}),
          ...(error &&
          !(children.props as Record<string, unknown>)["aria-errormessage"]
            ? { "aria-errormessage": errorId }
            : {}),
        },
      )
    : children;

  return (
    <Box
      ref={ref}
      className={finalClass}
      data-form-layout={formLayout || "stacked"}
      data-form-alignment={labelAlignment || "left"}
      style={
        {
          ...((restRecord.style as React.CSSProperties) || {}),
          ...(controlMaxWidth
            ? { "--form-control-max-width": controlMaxWidth }
            : {}),
          ...(controlMinWidth
            ? { "--form-control-min-width": controlMinWidth }
            : {}),
        } as React.CSSProperties
      }
      {...restRecord}
    >
      {/* 
        Section 1: The Native Custom Label
        Bypasses Mantine's built-in Input.Wrapper Label entirely in favor of explicit Recursica formatting.
      */}
      {label && (
        <div className={styles.labelSection}>
          <Label
            id={id} // Directly binds ARIA references down
            formLayout={formLayout}
            labelSize={labelSize}
            labelAlignment={labelAlignment}
            labelOptionalText={labelOptionalText}
            labelWithEditIcon={labelWithEditIcon}
            labelActionArea={labelActionArea}
            onLabelEditClick={onLabelEditClick}
            required={withAsterisk ?? required}
            // Manually propagate relevant structural logic if underlying groups dictate Label to act as generic wrapper
            {...(labelElement === "div" ? { as: "div" } : {})}
          >
            {label}
          </Label>
        </div>
      )}

      {/*
        Section 2: The Core Input Wrapper & Controls
        Nakedly inject the actual field elements alongside natively bridged Assistive components mapped dynamically.
      */}
      <div className={styles.inputSection}>
        {content}

        {error && (
          <AssistiveElement
            id={errorId}
            assistiveVariant="error"
            assistiveWithIcon={assistiveWithIcon}
          >
            {error}
          </AssistiveElement>
        )}

        {!error && resolvedAssistive && (
          <AssistiveElement
            id={assistiveId}
            assistiveVariant="help"
            assistiveWithIcon={assistiveWithIcon}
          >
            {resolvedAssistive}
          </AssistiveElement>
        )}
      </div>
    </Box>
  );
});

FormControlWrapper.displayName = "FormControlWrapper";

import React, { forwardRef, useId } from "react";
import { type InputWrapperProps } from "@mantine/core";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import { Label } from "../Label/Label";
import { FormControlLayout } from "../FormControlLayout/FormControlLayout";
import { AssistiveElement } from "../AssistiveElement/AssistiveElement";
import styles from "./FormControlWrapper.module.css";

import { type RecursicaFormControlWrapperProps } from "@recursica/adapter-common";
export type { RecursicaFormControlWrapperProps };

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

  const labelNode = label ? (
    <Label
      id={id} // Directly binds ARIA references down
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
  ) : undefined;

  return (
    <FormControlLayout
      ref={ref}
      className={finalClass}
      formLayout={formLayout}
      labelSize={labelSize}
      controlMaxWidth={controlMaxWidth}
      controlMinWidth={controlMinWidth}
      leftSection={labelNode}
      {...restRecord}
    >
      {/*
        The Core Input Wrapper & Controls
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
    </FormControlLayout>
  );
});

FormControlWrapper.displayName = "FormControlWrapper";

import React, { forwardRef, useId } from "react";
import { FormControl, type FormControlProps } from "@mui/material";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import { Label, type RecursicaLabelProps } from "../Label/Label";
import { FormControlLayout } from "../FormControlLayout/FormControlLayout";
import { AssistiveElement } from "../AssistiveElement/AssistiveElement";
import styles from "./FormControlWrapper.module.css";

export interface RecursicaFormControlWrapperProps extends RecursicaLabelProps {
  /** Overall structural flow mapping the Form Control natively cascading down to Label and Input logic. */
  formLayout?: "stacked" | "side-by-side";
  /** Securely replaces standard UI descriptions safely providing standard Assistive properties. */
  assistiveText?: React.ReactNode;
  /** Fallback for assistiveText to match Mantine API. */
  description?: React.ReactNode;
  /** Fallback for assistiveText to match MUI API. */
  helperText?: React.ReactNode;
  /** Explicit toggle to suppress the Info icon rendering natively alongside the assistiveText. Defaults to true. */
  assistiveWithIcon?: boolean;
  /** Custom action area to render alongside the label instead of the default edit icon. */
  labelActionArea?: React.ReactNode;
  /** Pass the native maximum width design variable dynamically bounding the specific wrapper width exclusively. */
  controlMaxWidth?: string | undefined;
  /** Pass the native minimum width design variable dynamically bounding the specific wrapper width exclusively. */
  controlMinWidth?: string | undefined;
  /** Error state which can be a boolean or a string message. */
  error?: boolean | React.ReactNode;
  /** Required state for the entire form control. */
  required?: boolean;
  /** The text string for the label. */
  label?: React.ReactNode;
}

export type FormControlWrapperProps = RecursicaOverStyled<
  Omit<FormControlProps, "margin" | "error" | "required"> &
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
    assistiveText,
    description,
    helperText,
    assistiveWithIcon = true,
    controlMaxWidth,
    controlMinWidth,
    error,
    required,
    id: userProvidedId,
    children,
    className,
    overStyled = false,
    ...rest
  },
  ref,
) {
  // Generate a reliable ID to map the Label's HTML context down to the component array natively.
  const generatedId = useId();
  const id = userProvidedId || `recursica-fc-${generatedId}`;

  // Evaluate explicit assistive fallbacks ensuring assistiveText correctly prioritizes natively over underlying UI configurations!
  const resolvedAssistive = assistiveText || description || helperText;
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
    >
      {label}
    </Label>
  ) : undefined;

  return (
    <FormControl
      ref={ref}
      error={!!error}
      required={required}
      className={finalClass}
      {...(restRecord as any)}
    >
      <FormControlLayout
        formLayout={formLayout}
        labelSize={labelSize}
        controlMaxWidth={controlMaxWidth}
        controlMinWidth={controlMinWidth}
        leftSection={labelNode}
      >
        {/*
          The Core Input Wrapper & Controls
          Nakedly inject the actual field elements alongside natively bridged Assistive components mapped dynamically.
        */}
        <div className={styles.inputSection}>
          {content}

          {error && typeof error !== "boolean" && (
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
    </FormControl>
  );
});

FormControlWrapper.displayName = "FormControlWrapper";

import React from "react";
import { FormControl, type FormControlProps } from "@mui/material";
import { filterStylingProps } from "../../utils/filterStylingProps";
import { Label } from "../Label/Label";
import { AssistiveElement } from "../AssistiveElement/AssistiveElement";
import { FormControlLayout } from "../FormControlLayout/FormControlLayout";
import styles from "./FormControlWrapper.module.css";

import { type RecursicaFormControlWrapperProps as BaseRecursicaFormControlWrapperProps } from "@recursica/adapter-common";

export interface RecursicaFormControlWrapperProps
  extends Omit<
      FormControlProps,
      "margin" | "variant" | "size" | "color" | "error"
    >,
    BaseRecursicaFormControlWrapperProps {
  overStyled?: boolean;
  label?: React.ReactNode;
  focused?: boolean;
  error?: React.ReactNode;
}

export type FormControlWrapperProps = RecursicaFormControlWrapperProps;

export const FormControlWrapper = React.forwardRef<
  HTMLDivElement,
  FormControlWrapperProps
>(function FormControlWrapper(props, ref) {
  const {
    overStyled = false,
    label,
    assistiveText,
    description,
    helperText,
    assistiveWithIcon = true,
    error,
    required,
    disabled,
    focused,
    id,

    formLayout = "stacked",
    labelSize = "default",
    labelOptionalText,
    labelWithEditIcon,
    onLabelEditClick,
    labelActionArea,

    controlMaxWidth,
    controlMinWidth,

    className,
    style,
    children,
    ...rest
  } = props;

  const sanitizedProps = filterStylingProps(rest, overStyled);

  // Map descriptions fallback exactly like Mantine
  const finalAssistiveText = assistiveText || description || helperText;

  // ARIA Bindings
  const labelId = id ? `${id}-label` : undefined;
  const descriptionId = id ? `${id}-description` : undefined;

  // Wrap children safely cloning aria hooks down natively
  const mappedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        "aria-labelledby": labelId,
        "aria-describedby": finalAssistiveText ? descriptionId : undefined,
      } as React.HTMLAttributes<HTMLElement>);
    }
    return child;
  });

  return (
    <FormControl
      ref={ref}
      error={!!error}
      required={required}
      disabled={disabled}
      focused={focused}
      className={className ? `${styles.root} ${className}` : styles.root}
      style={style}
      data-error={error ? "true" : undefined}
      data-disabled={disabled ? "true" : undefined}
      data-focused={focused ? "true" : undefined}
      {...(sanitizedProps as FormControlProps)}
    >
      <FormControlLayout
        formLayout={formLayout}
        labelSize={labelSize}
        controlMaxWidth={controlMaxWidth}
        controlMinWidth={controlMinWidth}
        leftSection={
          label && (
            <Label
              id={labelId}
              htmlFor={id}
              required={required}
              labelOptionalText={labelOptionalText}
              labelWithEditIcon={labelWithEditIcon}
              onLabelEditClick={onLabelEditClick}
              labelActionArea={labelActionArea}
            >
              {label}
            </Label>
          )
        }
      >
        <div className={styles.inputSection}>
          {/* Natively wrap children into flex box */}
          {mappedChildren}

          {/* Append native assistive block dynamically below the input */}
          {(finalAssistiveText || error) && (
            <AssistiveElement
              id={descriptionId}
              assistiveVariant={error ? "error" : "help"}
              assistiveWithIcon={assistiveWithIcon}
            >
              {error && typeof error === "string" ? error : finalAssistiveText}
            </AssistiveElement>
          )}
        </div>
      </FormControlLayout>
    </FormControl>
  );
});

FormControlWrapper.displayName = "FormControlWrapper";

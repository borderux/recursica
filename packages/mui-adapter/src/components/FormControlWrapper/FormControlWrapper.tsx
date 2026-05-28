import React from "react";
import { FormControl, type FormControlProps } from "@mui/material";
import { filterStylingProps } from "../../utils/filterStylingProps";
import { Label } from "../Label/Label";
import { AssistiveElement } from "../AssistiveElement/AssistiveElement";
import { FormControlLayout } from "../FormControlLayout/FormControlLayout";
import styles from "./FormControlWrapper.module.css";

export interface RecursicaFormControlWrapperProps
  extends Omit<FormControlProps, "margin" | "variant" | "size" | "color"> {
  overStyled?: boolean;
  label?: React.ReactNode;
  /** Primary assistive description bound natively to the component footer. Maps to MUI's 'helperText' dynamically. */
  assistiveText?: React.ReactNode;
  /** Secondary parameter fallback identical to assistiveText to match MUI / Mantine native APIs safely. */
  description?: React.ReactNode;
  /** Fallback mapping for MUI's native helperText */
  helperText?: React.ReactNode;
  assistiveWithIcon?: boolean;

  formLayout?: "stacked" | "side-by-side";
  labelSize?: "small" | "default" | "md";
  labelAlignment?: "left" | "right"; // Currently functionally maps to left automatically natively
  labelOptionalText?: React.ReactNode | true;
  labelWithEditIcon?: boolean;
  onLabelEditClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  labelActionArea?: React.ReactNode;

  /** Allows layout mapping to limit the input's bounding box without impacting the label */
  controlMaxWidth?: string;
  controlMinWidth?: string;
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

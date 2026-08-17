import React, { useId } from "react";
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
    id: userProvidedId,

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

  // Generate a reliable ID when the caller doesn't provide one — matches the Mantine adapter,
  // and is what makes the aria wiring below actually fire by default instead of only when a
  // caller happens to pass their own `id`.
  const generatedId = useId();
  const id = userProvidedId || `recursica-fc-${generatedId}`;

  // Map descriptions fallback exactly like Mantine
  const finalAssistiveText = assistiveText || description || helperText;

  // ARIA Bindings — separate ids for help text and error text (matching Mantine) so each can
  // be referenced independently via `aria-describedby`/`aria-errormessage` rather than sharing
  // one id for both.
  const labelId = `${id}-label`;
  const assistiveId = finalAssistiveText ? `${id}-assistive` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  // Wrap children safely cloning aria hooks down natively. Never clobber a child's own
  // explicit aria-describedby/aria-errormessage, matching Mantine's guard.
  const mappedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      const childProps = child.props as Record<string, unknown>;
      return React.cloneElement(child, {
        "aria-labelledby": labelId,
        ...(assistiveId && !childProps["aria-describedby"]
          ? { "aria-describedby": assistiveId }
          : {}),
        ...(errorId && !childProps["aria-errormessage"]
          ? { "aria-errormessage": errorId }
          : {}),
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
              id={error ? errorId : assistiveId}
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

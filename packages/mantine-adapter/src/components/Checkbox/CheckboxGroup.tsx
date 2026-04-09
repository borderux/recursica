import React, { forwardRef } from "react";
import {
  Checkbox as MantineCheckbox,
  type CheckboxGroupProps as MantineCheckboxGroupProps,
} from "@mantine/core";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import {
  FormControlWrapper,
  type RecursicaFormControlWrapperProps,
} from "../FormControlWrapper/FormControlWrapper";
import styles from "./Checkbox.module.css";

export interface RecursicaCheckboxGroupProps
  extends Omit<MantineCheckboxGroupProps, "size" | "labelProps">,
    RecursicaFormControlWrapperProps {}

export type CheckboxGroupProps =
  RecursicaOverStyled<RecursicaCheckboxGroupProps>;

export const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(
  function CheckboxGroup(
    {
      overStyled = false,
      formLayout = "stacked",

      // Label Wrappers
      labelSize,
      labelAlignment,
      labelOptionalText,
      labelWithEditIcon,
      onLabelEditClick,

      // Base Mantine Extracted Attributes
      label,
      description,
      assistiveText,
      assistiveWithIcon,
      error,
      required,
      withAsterisk,
      id,
      className,
      style,
      children,
      ...rest
    },
    ref,
  ) {
    // We isolate and filter the strictly remaining structural props that belong inherently to the DOM Input.
    const sanitizedProps = filterStylingProps(rest, overStyled);
    const restRecord = sanitizedProps as Record<string, unknown>;

    // Delete prohibited sizing hooks from bypassing the variables
    delete restRecord["size"];

    return (
      <FormControlWrapper
        className={className}
        style={style as React.CSSProperties}
        overStyled={overStyled}
        labelElement="div" // Strictly override. ARIA grouping prohibits interactive checkboxes nested natively inside <label>.
        formLayout={formLayout}
        labelSize={labelSize}
        labelAlignment={labelAlignment}
        labelOptionalText={labelOptionalText}
        labelWithEditIcon={labelWithEditIcon}
        onLabelEditClick={onLabelEditClick}
        label={label}
        description={description}
        assistiveText={assistiveText}
        assistiveWithIcon={assistiveWithIcon}
        error={error}
        required={required}
        withAsterisk={withAsterisk}
        id={id}
      >
        <MantineCheckbox.Group
          ref={ref}
          {...(sanitizedProps as unknown as MantineCheckboxGroupProps)}
        >
          <div className={styles.groupRoot} data-layout={formLayout}>
            {children}
          </div>
        </MantineCheckbox.Group>
      </FormControlWrapper>
    );
  },
);

CheckboxGroup.displayName = "CheckboxGroup";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { forwardRef } from "react";
import {
  Checkbox as MantineCheckbox,
  type CheckboxGroupProps as MantineCheckboxGroupProps,
} from "@mantine/core";
import { type ReadOnlyControlProps } from "@recursica/adapter-common";
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
    RecursicaFormControlWrapperProps,
    ReadOnlyControlProps {}

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
      readOnly,
      readOnlyComponent,
      ...rest
    },
    ref,
  ) {
    const sanitizedProps = filterStylingProps(rest, overStyled);
    const restRecord = sanitizedProps as Record<string, unknown>;

    // Delete prohibited sizing hooks from bypassing the variables
    delete restRecord["size"];

    if (readOnly && readOnlyComponent) {
      return (
        <FormControlWrapper
          className={className}
          style={style as React.CSSProperties}
          overStyled={overStyled as true}
          labelElement="div"
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
          {readOnlyComponent}
        </FormControlWrapper>
      );
    }

    return (
      <FormControlWrapper
        className={className}
        style={style as React.CSSProperties}
        overStyled={overStyled as true}
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
          /* Natively bind local disabled lock dynamically */
          {...(sanitizedProps as unknown as MantineCheckboxGroupProps)}
        >
          <div className={styles.groupRoot} data-layout={formLayout}>
            {/* If the exact group is read-only natively, we inject disabled hooks dynamically over children? Mantine handles native context directly! */}
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child as React.ReactElement<any>, {
                  disabled: readOnly || child.props.disabled,
                });
              }
              return child;
            })}
          </div>
        </MantineCheckbox.Group>
      </FormControlWrapper>
    );
  },
);

CheckboxGroup.displayName = "CheckboxGroup";

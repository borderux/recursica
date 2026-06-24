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
import { type RecursicaFormControlWrapperProps } from "../FormControlWrapper/FormControlWrapper";
import { WithReadOnlyWrapper } from "../ReadOnlyField/WithReadOnlyWrapper";
import styles from "./Checkbox.module.css";

import { type RecursicaCheckboxGroupProps as BaseRecursicaCheckboxGroupProps } from "@recursica/adapter-common";

export interface RecursicaCheckboxGroupProps
  extends Omit<
      MantineCheckboxGroupProps,
      "size" | "labelProps" | "defaultValue" | "value" | "onChange"
    >,
    Omit<
      RecursicaFormControlWrapperProps,
      "controlMaxWidth" | "controlMinWidth"
    >,
    ReadOnlyControlProps,
    BaseRecursicaCheckboxGroupProps {}

export type CheckboxGroupProps =
  RecursicaOverStyled<RecursicaCheckboxGroupProps>;

export const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(
  function CheckboxGroup(props, ref) {
    const {
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
      emptyValueComponent,
      value,
      defaultValue,
      ...rest
    } = props;
    const sanitizedProps = filterStylingProps(rest, overStyled);
    const restRecord = sanitizedProps as Record<string, unknown>;

    // Delete prohibited sizing hooks from bypassing the variables
    delete restRecord["size"];

    return (
      <WithReadOnlyWrapper
        className={className}
        style={style as React.CSSProperties}
        controlMaxWidth="var(--recursica_ui-kit_components_checkbox-item_properties_max-width)"
        controlMinWidth={undefined}
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
        readOnly={readOnly && !!readOnlyComponent}
        readOnlyComponent={readOnlyComponent}
        emptyValueComponent={emptyValueComponent}
        readOnlyType="text"
        readOnlyValue={value !== undefined ? value : defaultValue}
        readOnlyNativeProps={props}
        activeComponent={
          <MantineCheckbox.Group
            ref={ref}
            /* Natively bind local disabled lock dynamically */
            {...(sanitizedProps as unknown as MantineCheckboxGroupProps)}
            disabled={readOnly || (restRecord as any).disabled}
            value={value as any}
            defaultValue={defaultValue as any}
          >
            <div className={styles.groupRoot} data-layout={formLayout}>
              {children}
            </div>
          </MantineCheckbox.Group>
        }
      />
    );
  },
);

CheckboxGroup.displayName = "CheckboxGroup";

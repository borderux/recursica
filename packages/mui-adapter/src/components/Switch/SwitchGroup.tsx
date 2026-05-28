/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { forwardRef } from "react";
import {
  FormGroup as MuiFormGroup,
  type FormGroupProps as MuiFormGroupProps,
} from "@mui/material";
import { type ReadOnlyControlProps } from "@recursica/adapter-common";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import { type RecursicaFormControlWrapperProps } from "../FormControlWrapper/FormControlWrapper";
import { WithReadOnlyWrapper } from "../ReadOnlyField/WithReadOnlyWrapper";
import styles from "./Switch.module.css";

export interface RecursicaSwitchGroupProps
  extends Omit<
      MuiFormGroupProps,
      | "size"
      | "labelProps"
      | "onChange"
      | "classes"
      | "ref"
      | "value"
      | "defaultValue"
    >,
    Omit<
      RecursicaFormControlWrapperProps,
      "controlMaxWidth" | "controlMinWidth" | "classes" | "onChange"
    >,
    ReadOnlyControlProps {
  value?: any[];
  defaultValue?: any[];
  onChange?: (value: any[]) => void;
}

export type SwitchGroupProps = RecursicaOverStyled<RecursicaSwitchGroupProps>;

export const SwitchGroup = forwardRef<HTMLDivElement, SwitchGroupProps>(
  function SwitchGroup(props, ref) {
    const {
      overStyled = false,
      formLayout = "stacked",

      // Label Wrappers
      labelSize,
      labelAlignment,
      labelOptionalText,
      labelWithEditIcon,
      onLabelEditClick,

      // Base Mui Extracted Attributes
      label,
      description,
      assistiveText,
      assistiveWithIcon,
      error,
      required,
      // removed withAsterisk
      id,
      className,
      style,
      children,
      readOnly,
      readOnlyComponent,
      emptyValueComponent,
      value,
      defaultValue,
      onChange,
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
        controlMaxWidth="var(--recursica_ui-kit_components_switch-item_properties_label-max-width)"
        controlMinWidth={undefined}
        overStyled={overStyled as true}
        // Strictly override. ARIA grouping prohibits interactive switches nested natively inside <label>.
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
        id={id}
        readOnly={readOnly && !!readOnlyComponent}
        readOnlyComponent={readOnlyComponent}
        emptyValueComponent={emptyValueComponent}
        readOnlyType="text"
        readOnlyValue={value !== undefined ? value : defaultValue}
        readOnlyNativeProps={props}
        activeComponent={
          <MuiFormGroup
            ref={ref}
            {...(sanitizedProps as unknown as MuiFormGroupProps)}
            className={`${styles.groupRoot} ${(sanitizedProps as any).className || ""}`.trim()}
            data-layout={formLayout}
          >
            {children}
          </MuiFormGroup>
        }
      />
    );
  },
);

SwitchGroup.displayName = "SwitchGroup";

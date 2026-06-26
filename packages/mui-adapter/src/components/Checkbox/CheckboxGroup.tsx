/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { forwardRef } from "react";
import { type ReadOnlyControlProps } from "@recursica/adapter-common";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import { type RecursicaFormControlWrapperProps } from "../FormControlWrapper/FormControlWrapper";
import { WithReadOnlyWrapper } from "../ReadOnlyField/WithReadOnlyWrapper";
import styles from "./Checkbox.module.css";

import { FormGroup as MuiFormGroup } from "@mui/material";

// eslint-disable-next-line react-refresh/only-export-components
export const CheckboxGroupContext = React.createContext<{
  value?: any[];
  onChange?: (event: React.SyntheticEvent, value: any) => void;
  name?: string;
  readOnly?: boolean;
} | null>(null);

import { type RecursicaCheckboxGroupProps as BaseRecursicaCheckboxGroupProps } from "@recursica/adapter-common";

export interface RecursicaCheckboxGroupProps
  extends Omit<
      React.HTMLAttributes<HTMLDivElement>,
      "onChange" | "defaultValue"
    >,
    Omit<
      RecursicaFormControlWrapperProps,
      | "controlMaxWidth"
      | "controlMinWidth"
      | "onChange"
      | "classes"
      | "withAsterisk"
      | "defaultValue"
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
      row,
      ...rest
    } = props;
    const sanitizedProps = filterStylingProps(rest, overStyled);
    const restRecord = sanitizedProps as Record<string, unknown>;

    // Delete prohibited sizing hooks
    delete restRecord["size"];

    const handleChange = (_event: React.SyntheticEvent, childValue: any) => {
      if (onChange) {
        onChange(childValue);
      }
    };

    return (
      <WithReadOnlyWrapper
        className={className}
        style={style as React.CSSProperties}
        controlMaxWidth="var(--recursica_ui-kit_components_checkbox-item_properties_max-width)"
        controlMinWidth={undefined}
        overStyled={overStyled as true}
        // strictly override
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
          <CheckboxGroupContext.Provider
            value={{
              value: (value !== undefined ? value : defaultValue) as any[],
              onChange: handleChange,
              name: restRecord.name as string | undefined,
              readOnly: readOnly || !!(restRecord as any).disabled,
            }}
          >
            <MuiFormGroup
              ref={ref}
              row={row}
              {...(sanitizedProps as any)}
              className={`${styles.groupRoot} ${(sanitizedProps as any).className || ""}`.trim()}
              data-layout={formLayout}
            >
              {children}
            </MuiFormGroup>
          </CheckboxGroupContext.Provider>
        }
      />
    );
  },
);

CheckboxGroup.displayName = "CheckboxGroup";

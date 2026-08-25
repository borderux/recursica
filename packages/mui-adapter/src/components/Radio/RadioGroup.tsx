import React, { forwardRef } from "react";
import {
  // Removed unused Radio import
  RadioGroup as MuiRadioGroup,
  type RadioGroupProps as MuiRadioGroupProps,
} from "@mui/material";
import { type ReadOnlyControlProps } from "@recursica/adapter-common";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import { type RecursicaFormControlWrapperProps } from "../FormControlWrapper/FormControlWrapper";
import { WithReadOnlyWrapper } from "../ReadOnlyField/WithReadOnlyWrapper";
import styles from "./Radio.module.css";

import { type RecursicaRadioGroupProps as BaseRecursicaRadioGroupProps } from "@recursica/adapter-common";

export interface RecursicaRadioGroupProps
  extends Omit<
      MuiRadioGroupProps,
      "size" | "labelProps" | "classes" | "ref" | "value" | "defaultValue"
    >,
    Omit<
      RecursicaFormControlWrapperProps,
      | "controlMaxWidth"
      | "controlMinWidth"
      | "classes"
      | "onChange"
      | keyof MuiRadioGroupProps
    >,
    ReadOnlyControlProps,
    BaseRecursicaRadioGroupProps {}

export type RadioGroupProps = RecursicaOverStyled<RecursicaRadioGroupProps>;

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  function RadioGroup(props, ref) {
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      required,
      // Removed withAsterisk as it is not supported natively in this interface
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
    // NOTE: MuiRadioGroupProps (via FormGroupProps) has no native "size" (or other
    // Recursica-unsupported) prop to leak through here — nothing to add to an UNSUPPORTED_PROPS
    // list beyond what filterStylingProps already blocks.
    const sanitizedProps = filterStylingProps(rest, overStyled);

    return (
      <WithReadOnlyWrapper
        className={className}
        style={style as React.CSSProperties}
        controlMaxWidth="var(--recursica_ui-kit_components_radio-button-item_properties_max-width)"
        controlMinWidth={undefined}
        overStyled={overStyled as true}
        // Strictly override. ARIA grouping prohibits interactive radios nested natively inside <label>.
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
        id={id}
        readOnly={readOnly && !!readOnlyComponent}
        readOnlyComponent={readOnlyComponent}
        emptyValueComponent={emptyValueComponent}
        readOnlyType="text"
        readOnlyValue={value !== undefined ? value : defaultValue}
        readOnlyNativeProps={props}
        activeComponent={
          <MuiRadioGroup
            ref={ref}
            /* Natively bind local disabled lock dynamically */
            {...(sanitizedProps as unknown as MuiRadioGroupProps)}
            value={value}
            defaultValue={defaultValue}
            className={styles.groupRoot}
            data-layout={formLayout}
          >
            {children}
          </MuiRadioGroup>
        }
      />
    );
  },
);

RadioGroup.displayName = "RadioGroup";

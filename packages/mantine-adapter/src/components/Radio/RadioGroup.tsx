/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { forwardRef } from "react";
import {
  Radio as MantineRadio,
  type RadioGroupProps as MantineRadioGroupProps,
} from "@mantine/core";
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
  extends Omit<MantineRadioGroupProps, "size" | "labelProps">,
    Omit<
      RecursicaFormControlWrapperProps,
      "controlMaxWidth" | "controlMinWidth"
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
        controlMaxWidth="var(--recursica_ui-kit_components_radio-button-item_properties_max-width)"
        controlMinWidth={undefined}
        overStyled={overStyled as true}
        labelElement="div" // Strictly override. ARIA grouping prohibits interactive radios nested natively inside <label>.
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
          <MantineRadio.Group
            ref={ref}
            /* Natively bind local disabled lock dynamically */
            {...(sanitizedProps as unknown as MantineRadioGroupProps)}
            disabled={readOnly || (restRecord as any).disabled}
            value={value}
            defaultValue={defaultValue}
          >
            <div className={styles.groupRoot} data-layout={formLayout}>
              {children}
            </div>
          </MantineRadio.Group>
        }
      />
    );
  },
);

RadioGroup.displayName = "RadioGroup";

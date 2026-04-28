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
import {
  FormControlWrapper,
  type RecursicaFormControlWrapperProps,
} from "../FormControlWrapper/FormControlWrapper";
import styles from "./Radio.module.css";

export interface RecursicaRadioGroupProps
  extends Omit<MantineRadioGroupProps, "size" | "labelProps">,
    Omit<
      RecursicaFormControlWrapperProps,
      "controlMaxWidth" | "controlMinWidth"
    >,
    ReadOnlyControlProps {}

export type RadioGroupProps = RecursicaOverStyled<RecursicaRadioGroupProps>;

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  function RadioGroup(
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
          controlMaxWidth="var(--recursica_ui-kit_components_radio-button-item_properties_max-width)"
          controlMinWidth={undefined}
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
      >
        <MantineRadio.Group
          ref={ref}
          /* Natively bind local disabled lock dynamically */
          {...(sanitizedProps as unknown as MantineRadioGroupProps)}
        >
          <div className={styles.groupRoot} data-layout={formLayout}>
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child as React.ReactElement<any>, {
                  disabled: readOnly || (child.props as any).disabled,
                });
              }
              return child;
            })}
          </div>
        </MantineRadio.Group>
      </FormControlWrapper>
    );
  },
);

RadioGroup.displayName = "RadioGroup";

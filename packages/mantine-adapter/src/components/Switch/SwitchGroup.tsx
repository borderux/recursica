/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { forwardRef } from "react";
import {
  Switch as MantineSwitch,
  type SwitchGroupProps as MantineSwitchGroupProps,
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
import styles from "./Switch.module.css";

export interface RecursicaSwitchGroupProps
  extends Omit<MantineSwitchGroupProps, "size" | "labelProps">,
    Omit<
      RecursicaFormControlWrapperProps,
      "controlMaxWidth" | "controlMinWidth"
    >,
    ReadOnlyControlProps {}

export type SwitchGroupProps = RecursicaOverStyled<RecursicaSwitchGroupProps>;

export const SwitchGroup = forwardRef<HTMLDivElement, SwitchGroupProps>(
  function SwitchGroup(
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
          controlMaxWidth="var(--recursica_ui-kit_components_switch_properties_max-width)"
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
        controlMaxWidth="var(--recursica_ui-kit_components_switch_properties_max-width)"
        controlMinWidth={undefined}
        overStyled={overStyled as true}
        labelElement="div" // Strictly override. ARIA grouping prohibits interactive switches nested natively inside <label>.
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
        <MantineSwitch.Group
          ref={ref}
          /* Natively bind local disabled lock dynamically */
          {...(sanitizedProps as unknown as MantineSwitchGroupProps)}
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
        </MantineSwitch.Group>
      </FormControlWrapper>
    );
  },
);

SwitchGroup.displayName = "SwitchGroup";

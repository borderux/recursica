/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { forwardRef } from "react";
import {
  Switch as MuiSwitch,
  type SwitchGroupProps as MuiSwitchGroupProps,
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
  extends Omit<MuiSwitchGroupProps, "size" | "labelProps">,
    Omit<
      RecursicaFormControlWrapperProps,
      "controlMaxWidth" | "controlMinWidth"
    >,
    ReadOnlyControlProps {}

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
        withAsterisk={withAsterisk}
        id={id}
        readOnly={readOnly && !!readOnlyComponent}
        readOnlyComponent={readOnlyComponent}
        emptyValueComponent={emptyValueComponent}
        readOnlyType="text"
        readOnlyValue={value !== undefined ? value : defaultValue}
        readOnlyNativeProps={props}
        activeComponent={
          <div
            ref={ref}
            /* Natively bind local disabled lock dynamically */
            {...(sanitizedProps as unknown as MuiSwitchGroupProps)}
            disabled={readOnly || (restRecord as any).disabled}
            value={value}
            defaultValue={defaultValue}
          >
            <div className={styles.groupRoot} data-layout={formLayout}>
              {children}
            </div>
          </div>
        }
      />
    );
  },
);

const SwitchGroup = (() => {}) as any; // SwitchGroup.displayName = "SwitchGroup";

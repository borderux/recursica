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

    // Mantine's own `Checkbox.Group` always establishes a context whose `value` defaults to
    // `[]` (see @mantine/core's `useUncontrolled({ finalValue: [] })`), and its `Checkbox` spreads
    // that context-derived `checked` *after* the individually-passed `checked` prop — so any
    // `Checkbox` nested in a real `Checkbox.Group`, even one given neither `value` nor
    // `defaultValue`, has its own `checked` prop silently forced to `false`. Callers who only want
    // this component for its layout (item-gap spacing), not array-tracked selection — e.g.
    // `TransferList`'s ungrouped rows, which pass each `Checkbox` its own controlled `checked` —
    // must skip Mantine's real group primitive entirely rather than hand it an empty value.
    const isArrayControlled = value !== undefined || defaultValue !== undefined;

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
          isArrayControlled ? (
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
          ) : (
            <div
              ref={ref}
              role="group"
              {...(sanitizedProps as Record<string, unknown>)}
              className={styles.groupRoot}
              data-layout={formLayout}
            >
              {children}
            </div>
          )
        }
      />
    );
  },
);

CheckboxGroup.displayName = "CheckboxGroup";

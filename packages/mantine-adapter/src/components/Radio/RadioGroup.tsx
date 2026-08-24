/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { forwardRef } from "react";
import {
  Radio as MantineRadio,
  type RadioGroupProps as MantineRadioGroupProps,
} from "@mantine/core";
import { type ReadOnlyControlProps } from "@recursica/adapter-common";
import {
  filterStylingProps,
  omitUnsupportedProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import { type RecursicaFormControlWrapperProps } from "../FormControlWrapper/FormControlWrapper";
import { WithReadOnlyWrapper } from "../ReadOnlyField/WithReadOnlyWrapper";
import styles from "./Radio.module.css";

import { type RecursicaRadioGroupProps as BaseRecursicaRadioGroupProps } from "@recursica/adapter-common";

export interface RecursicaRadioGroupProps
  extends Omit<
      MantineRadioGroupProps,
      "size" | "labelProps" | "defaultValue" | "value"
    >,
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
    // Props this component intentionally doesn't support — deleted at runtime so they can't leak
    // through even if a caller forces them via plain JavaScript, bypassing the `Omit<>` above.
    const UNSUPPORTED_PROPS = [
      "size", // Recursica controls sizing via Radio.module.css variables, not Mantine's native size scale.
    ] as const satisfies readonly (keyof MantineRadioGroupProps)[];

    const sanitizedProps = omitUnsupportedProps(
      filterStylingProps(rest, overStyled) as Record<string, unknown>,
      UNSUPPORTED_PROPS,
    ) as Partial<typeof rest>;
    const restRecord = sanitizedProps as Record<string, unknown>;

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
            value={value as any}
            defaultValue={defaultValue as any}
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

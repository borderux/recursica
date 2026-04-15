import React, { forwardRef } from "react";
import {
  Select as MantineSelect,
  type SelectProps as MantineSelectProps,
} from "@mantine/core";
import { type ReadOnlyControlProps } from "@recursica/adapter-common";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import { type RecursicaFormControlWrapperProps } from "../FormControlWrapper/FormControlWrapper";
import { WithReadOnlyWrapper } from "../ReadOnlyField/WithReadOnlyWrapper";
import styles from "./Dropdown.module.css";

export interface RecursicaDropdownProps
  extends Omit<
      MantineSelectProps,
      | "size"
      | "variant"
      | "radius"
      | "wrapperProps"
      | "label"
      | "description"
      | "error"
      | "required"
      | "withAsterisk"
    >,
    Pick<
      RecursicaFormControlWrapperProps,
      | "label"
      | "error"
      | "required"
      | "withAsterisk"
      | "id"
      | "assistiveText"
      | "assistiveWithIcon"
      | "formLayout"
      | "labelSize"
      | "labelAlignment"
      | "labelOptionalText"
      | "labelWithEditIcon"
      | "onLabelEditClick"
    >,
    ReadOnlyControlProps {
  /** Internal hook for Selects to override raw layout width properties when necessary */
  containerWidth?: React.CSSProperties["width"];
}

export type DropdownProps = RecursicaOverStyled<RecursicaDropdownProps>;

export const Dropdown = forwardRef<HTMLInputElement, DropdownProps>(
  function Dropdown(
    {
      overStyled = false,
      formLayout = "stacked",
      containerWidth,

      // Label & Wrapper Maps
      labelSize,
      labelAlignment,
      labelOptionalText,
      labelWithEditIcon,
      onLabelEditClick,

      label,
      assistiveText,
      assistiveWithIcon,
      error,
      required,
      withAsterisk,
      id,
      className,
      style,
      disabled,
      readOnly,
      readOnlyComponent,
      value,
      defaultValue,
      data,
      ...rest
    },
    ref,
  ) {
    const sanitizedProps = filterStylingProps(rest, overStyled);
    const restRecord = sanitizedProps as Record<string, unknown>;

    // Delete prohibited sizing hooks from bypassing variables natively
    delete restRecord["size"];
    delete restRecord["variant"];
    delete restRecord["radius"];

    // Securely map core native blocks down ensuring nested CSS modules map precisely
    const mergedClassNames: Partial<Record<string, string>> = {
      wrapper: styles.root, // The nested Input internal relative wrapper bounding box
      input: styles.input,
      section: styles.section,
      dropdown: styles.dropdown,
      option: styles.option,
    };

    const classNamesProp = restRecord.classNames;
    if (
      classNamesProp &&
      typeof classNamesProp === "object" &&
      !Array.isArray(classNamesProp)
    ) {
      const o = classNamesProp as Partial<Record<string, string>>;
      mergedClassNames.wrapper = o.wrapper
        ? `${styles.root} ${o.wrapper}`
        : styles.root;
      mergedClassNames.input = o.input
        ? `${styles.input} ${o.input}`
        : styles.input;
      mergedClassNames.section = o.section
        ? `${styles.section} ${o.section}`
        : styles.section;
      mergedClassNames.dropdown = o.dropdown
        ? `${styles.dropdown} ${o.dropdown}`
        : styles.dropdown;
      mergedClassNames.option = o.option
        ? `${styles.option} ${o.option}`
        : styles.option;
    }

    const injectedStyles = {
      ...((style as React.CSSProperties) || {}),
      width: containerWidth || "100%",
    };

    return (
      <WithReadOnlyWrapper
        className={className}
        style={injectedStyles}
        controlMaxWidth="var(--recursica_ui-kit_components_dropdown_properties_max-width)"
        controlMinWidth="var(--recursica_ui-kit_components_dropdown_properties_min-width)"
        overStyled={overStyled as true}
        formLayout={formLayout}
        labelSize={labelSize}
        labelAlignment={labelAlignment}
        labelOptionalText={labelOptionalText}
        labelWithEditIcon={labelWithEditIcon}
        onLabelEditClick={onLabelEditClick}
        label={label}
        assistiveText={assistiveText}
        assistiveWithIcon={assistiveWithIcon}
        error={error}
        required={required}
        withAsterisk={withAsterisk}
        id={id}
        readOnly={readOnly}
        readOnlyComponent={readOnlyComponent}
        readOnlyType="text"
        readOnlyValue={
          value !== undefined
            ? String(value)
            : defaultValue
              ? String(defaultValue)
              : undefined
        }
        activeComponent={
          /* Naked Select execution safely decoupled from Mantine's macro Input.Wrapper DOM hooks */
          <MantineSelect
            ref={ref}
            classNames={mergedClassNames}
            disabled={disabled}
            value={value}
            defaultValue={defaultValue}
            data={data || []}
            label={undefined}
            description={undefined}
            error={undefined}
            required={undefined}
            withAsterisk={undefined}
            wrapperProps={{
              "data-disabled": disabled ? "true" : undefined,
              "data-error": error ? "true" : undefined,
            }}
            {...(sanitizedProps as unknown as MantineSelectProps)}
          />
        }
      />
    );
  },
);

Dropdown.displayName = "Dropdown";

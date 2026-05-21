import React, { forwardRef } from "react";
import { DatePickerInput, type DatePickerInputProps } from "@mantine/dates";
import { type ReadOnlyControlProps } from "@recursica/adapter-common";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import { type RecursicaFormControlWrapperProps } from "../FormControlWrapper/FormControlWrapper";
import { WithReadOnlyWrapper } from "../ReadOnlyField/WithReadOnlyWrapper";
import styles from "./DatePicker.module.css";

export interface RecursicaDatePickerProps
  extends Omit<
      DatePickerInputProps,
      | "size"
      | "variant"
      | "radius"
      | "wrapperProps"
      | "label"
      | "error"
      | "required"
      | "withAsterisk"
      | "id"
      | "description"
    >,
    Pick<
      DatePickerInputProps,
      "label" | "error" | "required" | "withAsterisk" | "id"
    >,
    Omit<
      RecursicaFormControlWrapperProps,
      "controlMaxWidth" | "controlMinWidth"
    >,
    ReadOnlyControlProps {}

export type DatePickerProps = RecursicaOverStyled<RecursicaDatePickerProps>;

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  function DatePicker(props, ref) {
    const {
      overStyled = false,
      formLayout = "stacked",

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
      emptyValueComponent,
      value,
      defaultValue,
      ...rest
    } = props;

    const sanitizedProps = filterStylingProps(rest, overStyled);
    const restRecord = sanitizedProps as Record<string, unknown>;

    // Delete prohibited sizing hooks from bypassing variables natively
    delete restRecord["size"];
    delete restRecord["variant"];
    delete restRecord["radius"];
    delete restRecord["description"]; // Managed by FormControlWrapper via assistiveText

    // Securely map core native blocks down ensuring nested CSS modules map precisely
    const mergedClassNames: Partial<Record<string, string>> = {
      wrapper: styles.root, // The nested Input internal relative wrapper bounding box
      input: styles.input,
      section: styles.section,
      dropdown: styles.dropdown,
      day: styles.day,
      calendarHeader: styles.calendarHeader,
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
    }

    const wrapperClass = className
      ? `${styles.layoutOverride} ${className}`
      : styles.layoutOverride;

    return (
      <WithReadOnlyWrapper
        className={wrapperClass}
        style={style as React.CSSProperties}
        controlMaxWidth={undefined}
        controlMinWidth={undefined}
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
        emptyValueComponent={emptyValueComponent}
        readOnlyType="text"
        readOnlyValue={
          value !== undefined
            ? String(value)
            : defaultValue
              ? String(defaultValue)
              : undefined
        }
        readOnlyNativeProps={props}
        activeComponent={
          /* Naked Input execution safely decoupled from Mantine's macro Input.Wrapper DOM hooks */
          <DatePickerInput
            ref={ref}
            classNames={mergedClassNames}
            disabled={disabled}
            // @ts-expect-error Mantine 8 DatePickerInput types are overly complex for unified wrappers
            value={value}
            // @ts-expect-error Mantine 8 DatePickerInput types are overly complex for unified wrappers
            defaultValue={defaultValue}
            label={undefined} // Disable Mantine's native label
            description={undefined} // Disable Mantine's native description
            error={undefined} // Disable Mantine's native error text (handled by wrapper)
            withAsterisk={false} // Handled by wrapper
            wrapperProps={{
              "data-disabled": disabled ? "true" : undefined,
              "data-error": error ? "true" : undefined,
            }}
            {...(sanitizedProps as unknown as DatePickerInputProps)}
          />
        }
      />
    );
  },
);

DatePicker.displayName = "DatePicker";

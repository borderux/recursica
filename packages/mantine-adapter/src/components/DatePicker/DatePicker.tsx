import React, { forwardRef } from "react";
import { DatePickerInput, type DatePickerInputProps } from "@mantine/dates";
import { type ReadOnlyControlProps } from "@recursica/adapter-common";
import {
  filterStylingProps,
  omitUnsupportedProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import { type RecursicaFormControlWrapperProps } from "../FormControlWrapper/FormControlWrapper";
import { WithReadOnlyWrapper } from "../ReadOnlyField/WithReadOnlyWrapper";
import { CalendarIcon } from "./DatePicker.icons";
import styles from "./DatePicker.module.css";

import { type RecursicaDatePickerProps as BaseRecursicaDatePickerProps } from "@recursica/adapter-common";

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
    ReadOnlyControlProps,
    BaseRecursicaDatePickerProps {}

export type DatePickerProps = RecursicaOverStyled<RecursicaDatePickerProps>;

// Props this component intentionally doesn't support — deleted at runtime so they can't leak
// through even if a caller forces them via plain JavaScript, bypassing the `Omit<>` above.
const UNSUPPORTED_PROPS = [
  "size", // Recursica controls sizing via the `size` variant + design tokens, not raw dimensions.
  "variant", // Colors/variants are token-driven; the library's native palette isn't exposed.
  "radius", // Recursica does not expose the library's native corner-radius system.
  "description", // Managed by FormControlWrapper via assistiveText.
] as const satisfies readonly (keyof DatePickerInputProps)[];

export const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>(
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

    const sanitizedProps = omitUnsupportedProps(
      filterStylingProps(rest, overStyled) as Record<string, unknown>,
      UNSUPPORTED_PROPS,
    );
    const restRecord = sanitizedProps as Record<string, unknown>;

    // Securely map core native blocks down ensuring nested CSS modules map precisely
    const mergedClassNames: Partial<Record<string, string>> = {
      wrapper: styles.root, // The nested Input internal relative wrapper bounding box
      input: styles.input,
      section: styles.section,
      day: styles.day,
      weekday: styles.weekday,
      calendarHeader: styles.calendarHeader,
      calendarHeaderControl: styles.calendarHeaderControl,
      calendarHeaderLevel: styles.calendarHeaderLevel,
      calendarHeaderControlIcon: styles.calendarHeaderControlIcon,
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

    // The calendar popover surface (.dropdown) is styled by Mantine's underlying `Popover`
    // component, not `DatePickerInput` itself — it only accepts classNames via `popoverProps`,
    // not the top-level `classNames` map above (which only reaches the Input/Calendar parts).
    const popoverPropsInput = restRecord.popoverProps;
    const consumerPopoverProps =
      popoverPropsInput &&
      typeof popoverPropsInput === "object" &&
      !Array.isArray(popoverPropsInput)
        ? (popoverPropsInput as Record<string, unknown>)
        : undefined;
    const consumerPopoverClassNames =
      consumerPopoverProps?.classNames &&
      typeof consumerPopoverProps.classNames === "object" &&
      !Array.isArray(consumerPopoverProps.classNames)
        ? (consumerPopoverProps.classNames as Partial<Record<string, string>>)
        : undefined;
    delete restRecord["popoverProps"];
    const mergedPopoverProps = {
      ...consumerPopoverProps,
      classNames: {
        ...consumerPopoverClassNames,
        dropdown: consumerPopoverClassNames?.dropdown
          ? `${styles.dropdown} ${consumerPopoverClassNames.dropdown}`
          : styles.dropdown,
      },
    };

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
            highlightToday // Default on so today is visually marked; consumers can still override via rest
            valueFormat="MM/DD/YY" // Default display format; consumers can still override via rest
            placeholder="MM / DD / YY" // Default placeholder; consumers can still override via rest
            leftSection={<CalendarIcon />} // Default leading icon; consumers can still override via rest
            {...(sanitizedProps as unknown as DatePickerInputProps)}
            classNames={mergedClassNames}
            disabled={disabled}
            value={value}
            defaultValue={defaultValue}
            label={undefined} // Disable Mantine's native label
            description={undefined} // Disable Mantine's native description
            error={undefined} // Disable Mantine's native error text (handled by wrapper)
            withAsterisk={false} // Handled by wrapper
            wrapperProps={{
              "data-disabled": disabled ? "true" : undefined,
              "data-error": error ? "true" : undefined,
            }}
            popoverProps={mergedPopoverProps}
          />
        }
      />
    );
  },
);

DatePicker.displayName = "DatePicker";

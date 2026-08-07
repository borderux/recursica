import React, { forwardRef } from "react";
import { TimeInput, type TimeInputProps } from "@mantine/dates";
import { type InputWrapperProps } from "@mantine/core";
import { type ReadOnlyControlProps } from "@recursica/adapter-common";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import { type RecursicaFormControlWrapperProps } from "../FormControlWrapper/FormControlWrapper";
import { WithReadOnlyWrapper } from "../ReadOnlyField/WithReadOnlyWrapper";
import styles from "./TimePicker.module.css";

import { type RecursicaTimePickerProps as BaseRecursicaTimePickerProps } from "@recursica/adapter-common";

export interface RecursicaTimePickerProps
  extends Omit<TimeInputProps, "size" | "variant" | "radius" | "wrapperProps">,
    Pick<
      InputWrapperProps,
      "label" | "error" | "required" | "withAsterisk" | "id"
    >,
    Omit<
      React.ComponentPropsWithoutRef<"input">,
      "size" | "style" | "className" | "id" | "value" | "defaultValue"
    >,
    Omit<
      RecursicaFormControlWrapperProps,
      "controlMaxWidth" | "controlMinWidth"
    >,
    ReadOnlyControlProps,
    BaseRecursicaTimePickerProps {}

export type TimePickerProps = RecursicaOverStyled<RecursicaTimePickerProps>;

export const TimePicker = forwardRef<HTMLInputElement, TimePickerProps>(
  function TimePicker(props, ref) {
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
      withSeconds,
      minTime,
      maxTime,
      ...rest
    } = props;

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
        readOnlyValue={value !== undefined ? value : defaultValue}
        readOnlyNativeProps={props}
        activeComponent={
          /* Naked Input execution safely decoupled from Mantine's macro Input.Wrapper DOM hooks */
          <TimeInput
            ref={ref}
            classNames={mergedClassNames}
            disabled={disabled}
            value={value as string | undefined}
            defaultValue={defaultValue as string | undefined}
            withSeconds={withSeconds}
            minTime={minTime}
            maxTime={maxTime}
            wrapperProps={{
              "data-disabled": disabled ? "true" : undefined,
              "data-error": error ? "true" : undefined,
            }}
            {...(sanitizedProps as unknown as TimeInputProps)}
          />
        }
      />
    );
  },
);

TimePicker.displayName = "TimePicker";

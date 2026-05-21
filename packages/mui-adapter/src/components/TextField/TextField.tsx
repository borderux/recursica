import React, { forwardRef } from "react";
import { InputBase, type InputBaseProps } from "@mui/material";
import { type ReadOnlyControlProps } from "@recursica/adapter-common";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import { type RecursicaFormControlWrapperProps } from "../FormControlWrapper/FormControlWrapper";
import { WithReadOnlyWrapper } from "../ReadOnlyField/WithReadOnlyWrapper";
import styles from "./TextField.module.css";

export interface RecursicaTextFieldProps
  extends Omit<
      InputBaseProps,
      "size" | "color" | "startAdornment" | "endAdornment"
    >,
    Pick<
      RecursicaFormControlWrapperProps,
      | "label"
      | "error"
      | "required"
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
    Omit<
      React.ComponentPropsWithoutRef<"input">,
      "size" | "style" | "className" | "id" | "color"
    >,
    ReadOnlyControlProps {
  /** Renders a section on the left side of the input (e.g. icon). Maps to Mantine's leftSection natively. */
  leftSection?: React.ReactNode;
  /** Renders a section on the right side of the input (e.g. clear button). Maps to Mantine's rightSection natively. */
  rightSection?: React.ReactNode;
}

export type TextFieldProps = RecursicaOverStyled<RecursicaTextFieldProps>;

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(props, ref) {
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
      id,
      className,
      style,
      disabled,
      readOnly,
      readOnlyComponent,
      emptyValueComponent,
      value,
      defaultValue,
      leftSection,
      rightSection,
      ...rest
    } = props;

    const sanitizedProps = filterStylingProps(rest, overStyled);
    const restRecord = sanitizedProps as Record<string, unknown>;

    // Delete prohibited sizing hooks from bypassing variables natively
    delete restRecord["size"];
    delete restRecord["color"];

    // Securely map core native blocks down ensuring nested CSS modules map precisely
    const mergedClassNames: Partial<Record<string, string>> = {
      wrapper: styles.root, // The nested Input internal relative wrapper bounding box
      input: styles.input,
      section: styles.section,
    };

    const classesProp = restRecord.classes;
    if (
      classesProp &&
      typeof classesProp === "object" &&
      !Array.isArray(classesProp)
    ) {
      const o = classesProp as Partial<Record<string, string>>;
      mergedClassNames.wrapper = o.root
        ? `${styles.root} ${o.root}`
        : styles.root;
      mergedClassNames.input = o.input
        ? `${styles.input} ${o.input}`
        : styles.input;
    }

    const wrapperClass = className
      ? `${styles.layoutOverride} ${className}`
      : styles.layoutOverride;

    const startAdornment = leftSection ? (
      <div className={mergedClassNames.section} data-position="left">
        {leftSection}
      </div>
    ) : undefined;

    const endAdornment = rightSection ? (
      <div className={mergedClassNames.section} data-position="right">
        {rightSection}
      </div>
    ) : undefined;

    return (
      <WithReadOnlyWrapper
        className={wrapperClass}
        style={style as React.CSSProperties}
        controlMaxWidth="var(--recursica_ui-kit_components_text-field_properties_max-width)"
        controlMinWidth="var(--recursica_ui-kit_components_text-field_properties_min-width)"
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
        id={id}
        readOnly={readOnly}
        readOnlyComponent={readOnlyComponent}
        emptyValueComponent={emptyValueComponent}
        readOnlyType="text"
        readOnlyValue={value !== undefined ? value : defaultValue}
        readOnlyNativeProps={props}
        activeComponent={
          /* Naked Input execution safely decoupled from MUI's macro FormControl DOM hooks */
          <InputBase
            inputRef={ref} // MUI specific forward ref mapping
            classes={{
              root: mergedClassNames.wrapper,
              input: mergedClassNames.input,
            }}
            disabled={disabled}
            value={value}
            defaultValue={defaultValue}
            startAdornment={startAdornment}
            endAdornment={endAdornment}
            // Bind native CSS selectors for errors / adornments explicitly to the root boundary
            data-disabled={disabled ? "true" : undefined}
            data-error={error ? "true" : undefined}
            data-with-left-section={leftSection ? "true" : undefined}
            data-with-right-section={rightSection ? "true" : undefined}
            {...(sanitizedProps as unknown as InputBaseProps)}
          />
        }
      />
    );
  },
);

TextField.displayName = "TextField";

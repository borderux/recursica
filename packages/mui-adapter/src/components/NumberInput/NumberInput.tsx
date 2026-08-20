import React, { forwardRef } from "react";
import {
  TextField as MuiNumberInput,
  type TextFieldProps as MuiNumberInputProps,
} from "@mui/material";
import { type ReadOnlyControlProps } from "@recursica/adapter-common";
import {
  filterStylingProps,
  omitUnsupportedProps,
  mergeClassNames,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import { type RecursicaFormControlWrapperProps } from "../FormControlWrapper/FormControlWrapper";
import { WithReadOnlyWrapper } from "../ReadOnlyField/WithReadOnlyWrapper";
import styles from "./NumberInput.module.css";

import { type RecursicaNumberInputProps as BaseRecursicaNumberInputProps } from "@recursica/adapter-common";

export interface RecursicaNumberInputProps
  extends Omit<
      MuiNumberInputProps,
      "size" | "variant" | "radius" | "wrapperProps" | "classNames" | "styles"
    >,
    Pick<
      RecursicaFormControlWrapperProps,
      | "assistiveText"
      | "assistiveWithIcon"
      | "formLayout"
      | "labelSize"
      | "labelAlignment"
      | "labelOptionalText"
      | "labelWithEditIcon"
      | "onLabelEditClick"
    >,
    ReadOnlyControlProps,
    BaseRecursicaNumberInputProps {}

export type NumberInputProps = RecursicaOverStyled<RecursicaNumberInputProps>;

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  function NumberInput(props, ref) {
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
      // removed withAsterisk
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
      min,
      max,
      step,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      hideControls = false,
      ...rest
    } = props;

    // Props this component intentionally doesn't support — deleted at runtime so they can't leak
    // through even if a caller forces them via plain JavaScript, bypassing the Omit<> above.
    const UNSUPPORTED_PROPS = [
      "size", // Recursica controls sizing via design tokens, not MUI's native small/medium size
      "variant", // Recursica styles the naked input directly; MUI's standard/filled/outlined unused
    ] as const satisfies readonly (keyof MuiNumberInputProps)[];

    const sanitizedProps = omitUnsupportedProps(
      filterStylingProps(rest, overStyled),
      UNSUPPORTED_PROPS,
    );
    const restRecord = sanitizedProps as Record<string, unknown>;

    // Securely map core native blocks down ensuring nested CSS modules map precisely. This
    // previously always overwrote the caller's `classes` prop wholesale (no merge at all) —
    // now merged per-slot via mergeClassNames so a caller-supplied slot value extends rather
    // than replaces ours.
    const mergedClassNames = mergeClassNames(
      {
        wrapper: styles.root, // The nested Input internal relative wrapper bounding box
        input: styles.input,
        section: styles.section,
        controls: styles.controls,
        control: styles.control,
      },
      restRecord.classes as Partial<Record<string, string>> | undefined,
    );

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
        controlMaxWidth="var(--number-input-control-max-width)"
        controlMinWidth="var(--number-input-control-min-width)"
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
        readOnlyValue={
          value !== undefined ? value?.toString() : defaultValue?.toString()
        }
        readOnlyNativeProps={props}
        activeComponent={
          /* Naked Input execution safely decoupled from Mui's macro Input.Wrapper DOM hooks */
          <MuiNumberInput
            ref={ref}
            {...(sanitizedProps as unknown as MuiNumberInputProps)}
            classes={
              mergedClassNames as unknown as MuiNumberInputProps["classes"]
            }
            disabled={disabled}
            value={value}
            defaultValue={defaultValue}
            label={undefined}
            error={undefined}
            required={undefined}
            InputProps={{
              startAdornment,
              endAdornment,
            }}
            inputProps={{
              min,
              max,
              step,
              ...(restRecord.inputProps as Record<string, unknown>),
            }}
          />
        }
      />
    );
  },
);

NumberInput.displayName = "NumberInput";

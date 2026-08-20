import React, { forwardRef } from "react";
import { InputBase, type InputBaseProps } from "@mui/material";
import { type ReadOnlyControlProps } from "@recursica/adapter-common";
import {
  filterStylingProps,
  omitUnsupportedProps,
  mergeClassNames,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import { type RecursicaFormControlWrapperProps } from "../FormControlWrapper/FormControlWrapper";
import { WithReadOnlyWrapper } from "../ReadOnlyField/WithReadOnlyWrapper";
import styles from "./TextField.module.css";

import { type RecursicaTextFieldProps as BaseRecursicaTextFieldProps } from "@recursica/adapter-common";

export interface RecursicaTextFieldProps
  extends Omit<
      InputBaseProps,
      | "color"
      | "size"
      | "startAdornment"
      | "endAdornment"
      | "autoComplete"
      | "error"
    >,
    Omit<
      React.ComponentPropsWithoutRef<"input">,
      keyof InputBaseProps | "size" | "color" | "style" | "className" | "id"
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
    ReadOnlyControlProps,
    BaseRecursicaTextFieldProps {}

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

    // Props this component intentionally doesn't support — deleted at runtime so they can't leak
    // through even if a caller forces them via plain JavaScript, bypassing the Omit<> above.
    const UNSUPPORTED_PROPS = [
      "size", // Recursica controls sizing via design tokens, not MUI's native small/medium size
      "color", // Colors are token-driven; MUI's native palette isn't exposed
    ] as const satisfies readonly (keyof InputBaseProps)[];

    const sanitizedProps = omitUnsupportedProps(
      filterStylingProps(rest, overStyled),
      UNSUPPORTED_PROPS,
    );
    const restRecord = sanitizedProps as Record<string, unknown>;

    // Securely map core native blocks down ensuring nested CSS modules map precisely. The
    // caller-facing "root"/"input" slot names (MUI's own InputBase `classes` shape) are
    // translated to this component's internal "wrapper"/"input" naming below.
    const callerClasses = restRecord.classes as
      | Partial<Record<string, string>>
      | undefined;
    const mergedClassNames = mergeClassNames(
      {
        wrapper: styles.root, // The nested Input internal relative wrapper bounding box
        input: styles.input,
        section: styles.section,
      },
      callerClasses && {
        wrapper: callerClasses.root,
        input: callerClasses.input,
      },
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
        controlMaxWidth="var(--text-field-control-max-width)"
        controlMinWidth="var(--text-field-control-min-width)"
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        readOnlyComponent={readOnlyComponent as any}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        emptyValueComponent={(emptyValueComponent as any) || undefined}
        readOnlyType="text"
        readOnlyValue={value !== undefined ? value : defaultValue}
        readOnlyNativeProps={props}
        activeComponent={
          /* Naked Input execution safely decoupled from MUI's macro FormControl DOM hooks */
          <InputBase
            inputRef={ref} // MUI specific forward ref mapping
            {...(sanitizedProps as unknown as InputBaseProps)}
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
          />
        }
      />
    );
  },
);

TextField.displayName = "TextField";

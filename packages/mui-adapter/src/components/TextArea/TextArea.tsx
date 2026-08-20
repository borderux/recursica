import React, { forwardRef } from "react";
import {
  TextField as MuiTextarea,
  type TextFieldProps as MuiTextareaProps,
} from "@mui/material";
import { type ReadOnlyControlProps } from "@recursica/adapter-common";
// Removed unused TextField import
import {
  filterStylingProps,
  omitUnsupportedProps,
  mergeClassNames,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import { type RecursicaFormControlWrapperProps } from "../FormControlWrapper/FormControlWrapper";
import { WithReadOnlyWrapper } from "../ReadOnlyField/WithReadOnlyWrapper";
import styles from "./TextArea.module.css";

import { type RecursicaTextAreaProps as BaseRecursicaTextAreaProps } from "@recursica/adapter-common";

export interface RecursicaTextAreaProps
  extends Omit<
      MuiTextareaProps,
      | keyof React.HTMLAttributes<HTMLDivElement>
      | "size"
      | "variant"
      | "radius"
      | "wrapperProps"
      | "maxRows"
      | "minRows"
      | "classes"
      | "error"
    >,
    Omit<
      RecursicaFormControlWrapperProps,
      "controlMaxWidth" | "controlMinWidth"
    >,
    ReadOnlyControlProps,
    BaseRecursicaTextAreaProps {}

export type TextAreaProps = RecursicaOverStyled<RecursicaTextAreaProps>;

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea(props, ref) {
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      autosize,
      ...rest
    } = props;

    // Props this component intentionally doesn't support — deleted at runtime so they can't leak
    // through even if a caller forces them via plain JavaScript, bypassing the Omit<> above.
    const UNSUPPORTED_PROPS = [
      "size", // Recursica controls sizing via design tokens, not MUI's native small/medium size
      "variant", // Recursica styles the naked textarea directly; MUI's standard/filled/outlined unused
    ] as const satisfies readonly (keyof MuiTextareaProps)[];

    const sanitizedProps = omitUnsupportedProps(
      filterStylingProps(rest, overStyled),
      UNSUPPORTED_PROPS,
    );
    const restRecord = sanitizedProps as Record<string, unknown>;

    // The `slotProps` prop is NOT omitted from this component's public type, so a caller can
    // legitimately supply it — merge it (rather than letting our own `slotProps.input` spread
    // after theirs and clobber `disableUnderline`/`classes`/`data-autosize` wholesale).
    const callerSlotProps = restRecord.slotProps as
      | { input?: Record<string, unknown> }
      | undefined;
    const mergedInputClasses = mergeClassNames(
      { root: styles.root, input: styles.input },
      callerSlotProps?.input?.classes as
        | Partial<Record<string, string>>
        | undefined,
    );

    const wrapperClass = className
      ? `${styles.layoutOverride} ${className}`
      : styles.layoutOverride;

    return (
      <WithReadOnlyWrapper
        className={wrapperClass}
        style={style as React.CSSProperties}
        controlMaxWidth="var(--textarea-control-max-width)"
        controlMinWidth="var(--textarea-control-min-width)"
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
          /* Naked Input execution safely decoupled from Mui's macro Input.Wrapper DOM hooks */
          <MuiTextarea
            {...(sanitizedProps as unknown as MuiTextareaProps)}
            multiline
            variant="standard"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            inputRef={ref as any}
            disabled={disabled}
            value={value}
            defaultValue={defaultValue}
            label={undefined}
            error={!!error}
            required={undefined}
            slotProps={{
              ...callerSlotProps,
              input: {
                ...callerSlotProps?.input,
                disableUnderline: true,
                classes: mergedInputClasses,
                ...({
                  "data-autosize": autosize ? "true" : undefined,
                } as Record<string, unknown>),
              },
            }}
          />
        }
      />
    );
  },
);

TextArea.displayName = "TextArea";

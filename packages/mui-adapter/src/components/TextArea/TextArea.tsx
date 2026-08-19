import React, { forwardRef } from "react";
import {
  TextField as MuiTextarea,
  type TextFieldProps as MuiTextareaProps,
} from "@mui/material";
import { type ReadOnlyControlProps } from "@recursica/adapter-common";
// Removed unused TextField import
import {
  filterStylingProps,
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
    const sanitizedProps = filterStylingProps(rest, overStyled);
    const restRecord = sanitizedProps as Record<string, unknown>;

    // Delete prohibited sizing hooks from bypassing variables natively
    delete restRecord["size"];
    delete restRecord["variant"];
    delete restRecord["radius"];

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
              input: {
                disableUnderline: true,
                classes: { root: styles.root, input: styles.input },
                ...({
                  "data-autosize": autosize ? "true" : undefined,
                } as Record<string, unknown>),
              },
            }}
            {...(sanitizedProps as unknown as MuiTextareaProps)}
          />
        }
      />
    );
  },
);

TextArea.displayName = "TextArea";

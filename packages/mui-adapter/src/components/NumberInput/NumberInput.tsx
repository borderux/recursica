import React, { forwardRef, useCallback } from "react";
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
import styles from "./NumberInput.module.css";

import { type RecursicaNumberInputProps as BaseRecursicaNumberInputProps } from "@recursica/adapter-common";

export interface RecursicaNumberInputProps
  extends Omit<
      InputBaseProps,
      | "color"
      | "size"
      | "startAdornment"
      | "endAdornment"
      | "autoComplete"
      | "error"
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
    BaseRecursicaNumberInputProps {}

export type NumberInputProps = RecursicaOverStyled<RecursicaNumberInputProps>;

// Props this component intentionally doesn't support — deleted at runtime so they can't leak
// through even if a caller forces them via plain JavaScript, bypassing the `Omit<>` above.
const UNSUPPORTED_PROPS = [
  "size", // Recursica controls sizing via design tokens, not MUI's native small/medium size
  "color", // Colors are token-driven; MUI's native palette isn't exposed
] as const satisfies readonly (keyof InputBaseProps)[];

// Keys a plain, non-destructive keystroke always passes through (navigation, editing, shortcuts).
const NON_CHARACTER_KEYS = new Set([
  "Backspace",
  "Delete",
  "Tab",
  "Escape",
  "Enter",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Home",
  "End",
]);

/**
 * Restricts keystrokes to what a numeric value can legally contain — digits, a single decimal
 * point, and (when negative values are allowed) a single leading minus sign. Mirrors Mantine's
 * `NumberInput`, which parses/rejects non-numeric characters internally; MUI's `InputBase` has
 * no such behavior built in, so it has to be reimplemented here.
 */
function isAllowedNumericKeystroke(
  event: React.KeyboardEvent<HTMLInputElement>,
  allowNegative: boolean,
): boolean {
  if (event.ctrlKey || event.metaKey || event.altKey) return true;
  if (NON_CHARACTER_KEYS.has(event.key)) return true;
  if (/^[0-9]$/.test(event.key)) return true;

  const target = event.currentTarget;
  if (event.key === "." && !target.value.includes(".")) return true;
  if (
    allowNegative &&
    event.key === "-" &&
    target.selectionStart === 0 &&
    !target.value.includes("-")
  ) {
    return true;
  }

  return false;
}

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
        controls: styles.controls,
        control: styles.control,
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

    // Mantine's NumberInput refuses a leading "-" once `min` rules out negative values; mirror
    // that here since it also drives what a keystroke is allowed to produce.
    const allowNegative = min === undefined || min < 0;

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isAllowedNumericKeystroke(event, allowNegative)) {
          event.preventDefault();
        }
        (
          restRecord.onKeyDown as
            | React.KeyboardEventHandler<HTMLInputElement>
            | undefined
        )?.(event);
      },
      [allowNegative, restRecord.onKeyDown],
    );

    const handlePaste = useCallback(
      (event: React.ClipboardEvent<HTMLInputElement>) => {
        const pasted = event.clipboardData.getData("text");
        const pattern = allowNegative
          ? /^-?[0-9]*\.?[0-9]*$/
          : /^[0-9]*\.?[0-9]*$/;
        if (!pattern.test(pasted)) {
          event.preventDefault();
        }
        (
          restRecord.onPaste as
            | React.ClipboardEventHandler<HTMLInputElement>
            | undefined
        )?.(event);
      },
      [allowNegative, restRecord.onPaste],
    );

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
          <InputBase
            inputRef={ref}
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
            inputMode="decimal"
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            inputProps={{
              min,
              max,
              step,
              ...(restRecord.inputProps as Record<string, unknown>),
            }}
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

NumberInput.displayName = "NumberInput";

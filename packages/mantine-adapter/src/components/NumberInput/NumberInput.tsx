import React, { forwardRef } from "react";
import {
  NumberInput as MantineNumberInput,
  type NumberInputProps as MantineNumberInputProps,
} from "@mantine/core";
import { type ReadOnlyControlProps } from "@recursica/adapter-common";
import {
  filterStylingProps,
  omitUnsupportedProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import { type RecursicaFormControlWrapperProps } from "../FormControlWrapper/FormControlWrapper";
import { WithReadOnlyWrapper } from "../ReadOnlyField/WithReadOnlyWrapper";
import styles from "./NumberInput.module.css";

import { type RecursicaNumberInputProps as BaseRecursicaNumberInputProps } from "@recursica/adapter-common";

export interface RecursicaNumberInputProps
  extends Omit<
      MantineNumberInputProps,
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

// Props this component intentionally doesn't support — deleted at runtime so they can't leak
// through even if a caller forces them via plain JavaScript, bypassing the `Omit<>` above.
const UNSUPPORTED_PROPS = [
  "size", // Recursica controls sizing via the `size` variant + design tokens, not raw dimensions.
  "variant", // Colors/variants are token-driven; the library's native palette isn't exposed.
  "radius", // Recursica does not expose the library's native corner-radius system.
] as const satisfies readonly (keyof MantineNumberInputProps)[];

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
      hideControls = false,
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
      controls: styles.controls,
      control: styles.control,
    };

    const wrapperClass = className
      ? `${styles.layoutOverride} ${className}`
      : styles.layoutOverride;

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
        withAsterisk={withAsterisk}
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
          /* Naked Input execution safely decoupled from Mantine's macro Input.Wrapper DOM hooks */
          <MantineNumberInput
            ref={ref}
            {...(sanitizedProps as unknown as MantineNumberInputProps)}
            classNames={mergedClassNames}
            disabled={disabled}
            value={value}
            defaultValue={defaultValue}
            hideControls={hideControls}
            label={undefined}
            description={undefined}
            error={undefined}
            required={undefined}
            withAsterisk={undefined}
            wrapperProps={{
              "data-disabled": disabled ? "true" : undefined,
              "data-error": error ? "true" : undefined,
              "data-with-left-section": restRecord.leftSection
                ? "true"
                : undefined,
              "data-with-right-section":
                restRecord.rightSection || !hideControls ? "true" : undefined,
            }}
          />
        }
      />
    );
  },
);

NumberInput.displayName = "NumberInput";

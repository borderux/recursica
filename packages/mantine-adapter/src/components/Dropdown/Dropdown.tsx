import React, { forwardRef } from "react";
import {
  Select as MantineSelect,
  type SelectProps as MantineSelectProps,
} from "@mantine/core";
import { type ReadOnlyControlProps } from "@recursica/adapter-common";
import {
  filterStylingProps,
  omitUnsupportedProps,
  mergeClassNames,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import { type RecursicaFormControlWrapperProps } from "../FormControlWrapper/FormControlWrapper";
import { WithReadOnlyWrapper } from "../ReadOnlyField/WithReadOnlyWrapper";
import styles from "./Dropdown.module.css";

import { type RecursicaDropdownProps as BaseRecursicaDropdownProps } from "@recursica/adapter-common";

export interface RecursicaDropdownProps
  extends Omit<
      MantineSelectProps,
      "size" | "variant" | "radius" | "wrapperProps" | "data"
    >,
    Omit<
      RecursicaFormControlWrapperProps,
      "controlMaxWidth" | "controlMinWidth"
    >,
    ReadOnlyControlProps,
    BaseRecursicaDropdownProps {}

export type DropdownProps = RecursicaOverStyled<RecursicaDropdownProps>;

// Props this component intentionally doesn't support — deleted at runtime so they can't leak
// through even if a caller forces them via plain JavaScript, bypassing the `Omit<>` above.
const UNSUPPORTED_PROPS = [
  "size", // Recursica controls sizing via the `size` variant + design tokens, not raw dimensions.
  "variant", // Colors/variants are token-driven; the library's native palette isn't exposed.
  "radius", // Recursica does not expose the library's native corner-radius system.
] as const satisfies readonly (keyof MantineSelectProps)[];

export const Dropdown = forwardRef<HTMLInputElement, DropdownProps>(
  function Dropdown(props, ref) {
    const {
      overStyled = false,
      formLayout = "stacked",
      containerWidth,

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
      data,
      ...rest
    } = props;
    const sanitizedProps = omitUnsupportedProps(
      filterStylingProps(rest, overStyled) as Record<string, unknown>,
      UNSUPPORTED_PROPS,
    );
    const restRecord = sanitizedProps as Record<string, unknown>;

    // Securely map core native blocks down ensuring nested CSS modules map precisely
    const mergedClassNames = mergeClassNames(
      {
        wrapper: styles.root, // The nested Input internal relative wrapper bounding box
        input: styles.input,
        section: styles.section,
        dropdown: styles.dropdown,
        option: styles.option,
      },
      restRecord.classNames as Partial<Record<string, string>> | undefined,
    );

    const injectedStyles = {
      ...((style as React.CSSProperties) || {}),
      width: containerWidth || "100%",
    };

    const wrapperClass = className
      ? `${styles.layoutOverride} ${className}`
      : styles.layoutOverride;

    return (
      <WithReadOnlyWrapper
        className={wrapperClass}
        style={injectedStyles}
        controlMaxWidth="var(--dropdown-control-max-width)"
        controlMinWidth="var(--dropdown-control-min-width)"
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
          /* Naked Select execution safely decoupled from Mantine's macro Input.Wrapper DOM hooks */
          <MantineSelect
            ref={ref}
            {...(sanitizedProps as unknown as MantineSelectProps)}
            classNames={mergedClassNames}
            disabled={disabled}
            value={value}
            defaultValue={defaultValue}
            data={(data as unknown as MantineSelectProps["data"]) || []}
            label={undefined}
            description={undefined}
            error={undefined}
            required={undefined}
            withAsterisk={undefined}
            // `wrapperProps` targets Mantine's *outer* `Input.Wrapper` (the label/description/error
            // stacking element) — a different, ancestor element from the "wrapper" styles-api slot
            // that actually carries `styles.root`'s border/background. Dropdown.module.css's error/
            // disabled rules (`.root[data-error]`/`[data-disabled]`) need the attribute on that
            // inner element, so `attributes.wrapper` (which targets the same slot as
            // `classNames.wrapper`) is the correct hook — `wrapperProps` here meant the error state
            // never actually applied a border color.
            attributes={{
              wrapper: {
                "data-disabled": disabled ? "true" : undefined,
                "data-error": error ? "true" : undefined,
              },
            }}
          />
        }
      />
    );
  },
);

Dropdown.displayName = "Dropdown";

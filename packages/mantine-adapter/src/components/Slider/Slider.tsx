import React, { forwardRef, useState, useEffect } from "react";
import {
  Slider as MantineSlider,
  type SliderProps as MantineSliderProps,
  type InputWrapperProps,
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

import styles from "./Slider.module.css";

import { type RecursicaSliderProps as BaseRecursicaSliderProps } from "@recursica/adapter-common";

export interface RecursicaSliderProps
  extends Omit<
      MantineSliderProps,
      | "size"
      | "variant"
      | "radius"
      | "wrapperProps"
      | "classNames"
      | "styles"
      | "label"
    >,
    Omit<
      RecursicaFormControlWrapperProps,
      "controlMaxWidth" | "controlMinWidth"
    >,
    Pick<InputWrapperProps, "error" | "required" | "withAsterisk">,
    ReadOnlyControlProps,
    BaseRecursicaSliderProps {}

export type SliderProps = RecursicaOverStyled<RecursicaSliderProps>;

/**
 * Custom Read-Only visual representation of the Slider value.
 * Utilizes component-specific read-only typography variables.
 */
const SliderReadOnlyValue: React.FC<{ value: number }> = ({ value }) => {
  return <div className={styles.readOnlyValue}>{value}</div>;
};

/**
 * Recursica Slider component wrapping Mantine's Slider.
 *
 * Implements a bidirectional text input field next to the slider track, responsive layouts,
 * custom typography-bound min/max labels, an optional leading icon, and an explicit read-only layout.
 */
export const Slider = forwardRef<HTMLDivElement, SliderProps>(
  function Slider(props, ref) {
    const {
      overStyled = false,
      formLayout = "stacked",

      // Label & Wrapper Maps
      labelSize,
      labelAlignment,
      labelOptionalText,
      labelWithEditIcon,
      labelActionArea,
      onLabelEditClick,

      label,
      tooltipLabel,
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
      icon,
      showInput = false,
      showMinMaxLabels = true,
      min = 0,
      max = 100,
      step = 1,
      onChange,
      onChangeEnd,
      ...rest
    } = props;

    // Bidirectional state linking the slider track value to the input field string representation
    const [internalValue, setInternalValue] = useState<number>(() => {
      if (value !== undefined) return value;
      if (defaultValue !== undefined) return defaultValue;
      return min;
    });

    const resolvedValue = value !== undefined ? value : internalValue;
    const [inputValue, setInputValue] = useState<string>(
      resolvedValue.toString(),
    );

    // Synchronize text input whenever the slider value changes
    useEffect(() => {
      setInputValue(resolvedValue.toString());
    }, [resolvedValue]);

    const handleValueChange = (val: number) => {
      if (value === undefined) {
        setInternalValue(val);
      }
      onChange?.(val);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const valStr = e.target.value;
      setInputValue(valStr);

      const parsed = parseFloat(valStr);
      if (!isNaN(parsed)) {
        // Clamp input value to bounds
        const clamped = Math.max(min, Math.min(max, parsed));
        handleValueChange(clamped);
      }
    };

    const handleInputBlur = () => {
      // Clean up text field on blur to reflect the final clamped resolved value
      setInputValue(resolvedValue.toString());
    };

    // Props this component intentionally doesn't support — deleted at runtime so they can't leak
    // through even if a caller forces them via plain JavaScript, bypassing the `Omit<>` above.
    const UNSUPPORTED_PROPS = [
      "size", // Recursica controls sizing via Slider.module.css variables, not Mantine's native size scale.
      "variant", // Slider has a single Recursica-defined visual treatment; Mantine's variant isn't exposed.
      "radius", // Corner radius is fixed by Recursica tokens in Slider.module.css, not caller-configurable.
      // Not currently a real key of Mantine's SliderProps (that's an Input.Wrapper-only prop) — kept
      // as a defensive no-op delete since it predates this consolidation and the public prop type
      // already `Omit`s it; Recursica's own FormControlLayout/WithReadOnlyWrapper own wrapper markup.
      "wrapperProps",
    ] as const satisfies readonly (keyof MantineSliderProps | "wrapperProps")[];

    const sanitizedProps = omitUnsupportedProps(
      filterStylingProps(rest, overStyled) as Record<string, unknown>,
      UNSUPPORTED_PROPS,
    ) as Partial<typeof rest>;
    const restRecord = sanitizedProps as Record<string, unknown>;

    // Securely map core native blocks down ensuring nested CSS modules map precisely
    const mergedClassNames = mergeClassNames(
      {
        root: styles.sliderRoot,
        track: styles.sliderTrack,
        bar: styles.sliderBar,
        thumb: styles.sliderThumb,
        mark: styles.sliderMark,
        markLabel: styles.sliderMarkLabel,
      },
      restRecord.classNames as Partial<Record<string, string>> | undefined,
    );

    const wrapperClass = className
      ? `${styles.layoutOverride} ${className}`
      : styles.layoutOverride;

    const leadingIcon = icon ? (
      <span className={styles.iconWrapper} aria-hidden>
        {icon}
      </span>
    ) : null;

    return (
      <WithReadOnlyWrapper
        ref={ref}
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
        labelActionArea={labelActionArea}
        onLabelEditClick={onLabelEditClick}
        label={label}
        assistiveText={assistiveText}
        assistiveWithIcon={assistiveWithIcon}
        error={error}
        required={required}
        withAsterisk={withAsterisk}
        id={id}
        readOnly={readOnly}
        readOnlyComponent={readOnlyComponent || SliderReadOnlyValue}
        emptyValueComponent={emptyValueComponent}
        readOnlyType="text"
        readOnlyValue={resolvedValue}
        readOnlyNativeProps={{ value: resolvedValue }}
        activeComponent={
          <div
            className={styles.sliderContainer}
            data-form-layout={formLayout}
            data-disabled={disabled ? "true" : undefined}
            data-error={error ? "true" : undefined}
          >
            {leadingIcon}

            {showMinMaxLabels && (
              <span className={styles.minMaxGuide}>{min}</span>
            )}

            <div className={styles.sliderTrackWrapper}>
              <MantineSlider
                {...(sanitizedProps as unknown as MantineSliderProps)}
                classNames={mergedClassNames}
                disabled={disabled}
                value={resolvedValue}
                onChange={handleValueChange}
                onChangeEnd={onChangeEnd}
                min={min}
                max={max}
                step={step}
                label={tooltipLabel}
              />
            </div>

            <div className={styles.rightGuideContainer}>
              {!showInput && (
                <span className={styles.currentValue}>{resolvedValue}</span>
              )}
              {showMinMaxLabels && (
                <span className={styles.minMaxGuide}>{max}</span>
              )}
            </div>

            {showInput && (
              <input
                type="number"
                className={styles.inputField}
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                min={min}
                max={max}
                step={step}
                disabled={disabled}
                data-error={error ? "true" : undefined}
              />
            )}
          </div>
        }
      />
    );
  },
);

Slider.displayName = "Slider";

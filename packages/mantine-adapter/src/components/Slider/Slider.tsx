import React, { forwardRef, useState, useEffect } from "react";
import {
  Slider as MantineSlider,
  RangeSlider as MantineRangeSlider,
  type SliderProps as MantineSliderProps,
  type RangeSliderProps as MantineRangeSliderProps,
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
      | "value"
      | "defaultValue"
      | "onChange"
      | "onChangeEnd"
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
 * Utilizes component-specific read-only typography variables. Renders a "lower – upper" pair
 * when the value is a range tuple.
 */
const SliderReadOnlyValue: React.FC<{ value: number | [number, number] }> = ({
  value,
}) => {
  const display = Array.isArray(value) ? `${value[0]} – ${value[1]}` : value;
  return <div className={styles.readOnlyValue}>{display}</div>;
};

/**
 * Recursica Slider component wrapping Mantine's Slider (or, when `value`/`defaultValue` is a
 * `[number, number]` tuple, Mantine's two-thumb RangeSlider).
 *
 * Implements a bidirectional text input field next to the slider track, responsive layouts,
 * custom typography-bound min/max labels (optionally overridden via `minLabel`/`maxLabel`),
 * optional leading/trailing icons, and an explicit read-only layout.
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
      trailingIcon,
      showInput = false,
      showMinMaxLabels = true,
      min = 0,
      max = 100,
      minLabel,
      maxLabel,
      step = 1,
      onChange,
      onChangeEnd,
      ...rest
    } = props;

    // Bidirectional state linking the slider track value to the input field string
    // representation. A `[number, number]` value/defaultValue switches the component into
    // two-thumb range mode, backed by Mantine's RangeSlider instead of Slider.
    type SliderValue = number | [number, number];

    const [internalValue, setInternalValue] = useState<SliderValue>(() => {
      if (value !== undefined) return value;
      if (defaultValue !== undefined) return defaultValue;
      return min;
    });

    const resolvedValue: SliderValue =
      value !== undefined ? value : internalValue;
    const isRange = Array.isArray(resolvedValue);

    const [inputValue, setInputValue] = useState<string | [string, string]>(
      () =>
        Array.isArray(resolvedValue)
          ? [resolvedValue[0].toString(), resolvedValue[1].toString()]
          : resolvedValue.toString(),
    );

    // Synchronize text input(s) whenever the slider value changes
    useEffect(() => {
      setInputValue(
        Array.isArray(resolvedValue)
          ? [resolvedValue[0].toString(), resolvedValue[1].toString()]
          : resolvedValue.toString(),
      );
    }, [resolvedValue]);

    const handleValueChange = (val: SliderValue) => {
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
      setInputValue((resolvedValue as number).toString());
    };

    // Range-mode input handlers: each bound clamps against the other thumb rather than the
    // shared min/max, so the lower thumb can never cross the upper one and vice versa.
    const handleLowerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const current = resolvedValue as [number, number];
      const valStr = e.target.value;
      setInputValue([valStr, current[1].toString()]);

      const parsed = parseFloat(valStr);
      if (!isNaN(parsed)) {
        const clamped = Math.max(min, Math.min(current[1], parsed));
        handleValueChange([clamped, current[1]]);
      }
    };

    const handleUpperInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const current = resolvedValue as [number, number];
      const valStr = e.target.value;
      setInputValue([current[0].toString(), valStr]);

      const parsed = parseFloat(valStr);
      if (!isNaN(parsed)) {
        const clamped = Math.max(current[0], Math.min(max, parsed));
        handleValueChange([current[0], clamped]);
      }
    };

    const handleRangeInputBlur = () => {
      const current = resolvedValue as [number, number];
      setInputValue([current[0].toString(), current[1].toString()]);
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
        markWrapper: styles.sliderMarkWrapper,
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

    const trailingIconEl = trailingIcon ? (
      <span className={styles.iconWrapper} aria-hidden>
        {trailingIcon}
      </span>
    ) : null;

    // Duplicates the raw numeric value next to the track by default; when `tooltipLabel` is a
    // formatter, reuse it here too so both displays agree instead of one showing raw numbers.
    // Range mode formats each thumb independently and joins them with an en dash.
    const displayValue = Array.isArray(resolvedValue)
      ? typeof tooltipLabel === "function"
        ? `${tooltipLabel(resolvedValue[0])} – ${tooltipLabel(resolvedValue[1])}`
        : `${resolvedValue[0]} – ${resolvedValue[1]}`
      : typeof tooltipLabel === "function"
        ? tooltipLabel(resolvedValue)
        : resolvedValue;

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
            {isRange && showInput && (
              <input
                type="number"
                className={styles.inputField}
                value={(inputValue as [string, string])[0]}
                onChange={handleLowerInputChange}
                onBlur={handleRangeInputBlur}
                min={min}
                max={(resolvedValue as [number, number])[1]}
                step={step}
                disabled={disabled}
                data-error={error ? "true" : undefined}
                aria-label="Minimum value"
              />
            )}

            {leadingIcon}

            {showMinMaxLabels && (
              <span className={styles.minMaxGuide}>{minLabel ?? min}</span>
            )}

            <div className={styles.sliderTrackWrapper}>
              {isRange ? (
                <MantineRangeSlider
                  {...(sanitizedProps as unknown as MantineRangeSliderProps)}
                  classNames={mergedClassNames}
                  disabled={disabled}
                  value={resolvedValue as [number, number]}
                  onChange={handleValueChange}
                  onChangeEnd={onChangeEnd}
                  min={min}
                  max={max}
                  step={step}
                  label={tooltipLabel}
                />
              ) : (
                <MantineSlider
                  {...(sanitizedProps as unknown as MantineSliderProps)}
                  classNames={mergedClassNames}
                  disabled={disabled}
                  value={resolvedValue as number}
                  onChange={handleValueChange}
                  onChangeEnd={onChangeEnd}
                  min={min}
                  max={max}
                  step={step}
                  label={tooltipLabel}
                />
              )}
            </div>

            <div className={styles.rightGuideContainer}>
              {!showInput && (
                <span className={styles.currentValue}>{displayValue}</span>
              )}
              {showMinMaxLabels && (
                <span className={styles.minMaxGuide}>{maxLabel ?? max}</span>
              )}
            </div>

            {trailingIconEl}

            {showInput &&
              (isRange ? (
                <input
                  type="number"
                  className={styles.inputField}
                  value={(inputValue as [string, string])[1]}
                  onChange={handleUpperInputChange}
                  onBlur={handleRangeInputBlur}
                  min={(resolvedValue as [number, number])[0]}
                  max={max}
                  step={step}
                  disabled={disabled}
                  data-error={error ? "true" : undefined}
                  aria-label="Maximum value"
                />
              ) : (
                <input
                  type="number"
                  className={styles.inputField}
                  value={inputValue as string}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  min={min}
                  max={max}
                  step={step}
                  disabled={disabled}
                  data-error={error ? "true" : undefined}
                />
              ))}
          </div>
        }
      />
    );
  },
);

Slider.displayName = "Slider";

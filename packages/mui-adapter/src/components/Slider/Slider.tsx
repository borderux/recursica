import React, { forwardRef, useState, useEffect, useRef } from "react";
import {
  Slider as MuiSlider,
  type SliderProps as MuiSliderProps,
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

import styles from "./Slider.module.css";

import { type RecursicaSliderProps as BaseRecursicaSliderProps } from "@recursica/adapter-common";

export interface RecursicaSliderProps
  extends Omit<
      MuiSliderProps,
      | "size"
      | "color"
      | "classes"
      | "onChange"
      | "onChangeCommitted"
      | "value"
      | "defaultValue"
    >,
    Omit<
      RecursicaFormControlWrapperProps,
      | "controlMaxWidth"
      | "controlMinWidth"
      | "error"
      | "required"
      | "withAsterisk"
      | keyof MuiSliderProps
    >,
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
 * Recursica Slider component wrapping Mui's Slider.
 *
 * MUI's own `Slider` already renders two thumbs natively when given a tuple `value`, so range
 * mode here is a typing/handler concern rather than a different underlying component (contrast
 * with the mantine-adapter, which swaps in Mantine's separate `RangeSlider`).
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
    // two-thumb range mode — MUI's own Slider already renders two thumbs for a tuple value.
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

    const handleValueChange = (_e: Event, val: number | number[]) => {
      const normalized: SliderValue = Array.isArray(val)
        ? [val[0], val[1]]
        : val;
      if (value === undefined) {
        setInternalValue(normalized);
      }
      onChange?.(normalized);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const valStr = e.target.value;
      setInputValue(valStr);

      const parsed = parseFloat(valStr);
      if (!isNaN(parsed)) {
        // Clamp input value to bounds
        const clamped = Math.max(min, Math.min(max, parsed));
        handleValueChange(null as unknown as Event, clamped);
      }
    };

    const handleInputBlur = () => {
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
        handleValueChange(null as unknown as Event, [clamped, current[1]]);
      }
    };

    const handleUpperInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const current = resolvedValue as [number, number];
      const valStr = e.target.value;
      setInputValue([current[0].toString(), valStr]);

      const parsed = parseFloat(valStr);
      if (!isNaN(parsed)) {
        const clamped = Math.max(current[0], Math.min(max, parsed));
        handleValueChange(null as unknown as Event, [current[0], clamped]);
      }
    };

    const handleRangeInputBlur = () => {
      const current = resolvedValue as [number, number];
      setInputValue([current[0].toString(), current[1].toString()]);
    };

    // Props this component intentionally doesn't support — deleted at runtime so they can't leak
    // through even if a caller forces them via plain JavaScript, bypassing the Omit<> above.
    const UNSUPPORTED_PROPS = [
      "size", // Recursica controls sizing via design tokens, not MUI's native small/medium size
      "color", // Colors are token-driven; MUI's native palette isn't exposed
    ] as const satisfies readonly (keyof MuiSliderProps)[];

    const sanitizedProps = omitUnsupportedProps(
      filterStylingProps(rest, overStyled),
      UNSUPPORTED_PROPS,
    );
    const restRecord = sanitizedProps as Record<string, unknown>;

    // MUI always programmatically re-focuses its hidden native input on pointer interaction,
    // which browsers' `:focus-visible` heuristic treats as keyboard-visible — unlike Mantine's
    // plain div thumb, where a real click correctly resolves to a non-visible focus. Track
    // pointer-vs-keyboard ourselves so the focus ring only paints for genuine keyboard focus,
    // matching Mantine (a later keypress while still focused reveals the ring, same as native).
    const pointerDownRef = useRef(false);
    const [suppressFocusRing, setSuppressFocusRing] = useState(false);
    const externalOnMouseDown = (sanitizedProps as MuiSliderProps).onMouseDown;
    const externalOnFocus = (sanitizedProps as MuiSliderProps).onFocus;
    const externalOnBlur = (sanitizedProps as MuiSliderProps).onBlur;
    const externalOnKeyDown = (sanitizedProps as MuiSliderProps).onKeyDown;

    const handleThumbMouseDown = (e: React.MouseEvent<HTMLSpanElement>) => {
      pointerDownRef.current = true;
      externalOnMouseDown?.(e);
    };
    const handleThumbFocus = (e: React.FocusEvent<HTMLSpanElement>) => {
      setSuppressFocusRing(pointerDownRef.current);
      pointerDownRef.current = false;
      externalOnFocus?.(e);
    };
    const handleThumbBlur = (e: React.FocusEvent<HTMLSpanElement>) => {
      setSuppressFocusRing(false);
      externalOnBlur?.(e);
    };
    const handleThumbKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
      setSuppressFocusRing(false);
      externalOnKeyDown?.(e);
    };

    // Securely map core native blocks down ensuring nested CSS modules map precisely. Note MUI's
    // actual prop is "classes", not "classNames" (that's Mantine's naming) — this used to read
    // the wrong key, silently no-op-ing any caller-supplied classes. The caller-facing slot names
    // below (root/track/bar/thumb/mark/markLabel) mirror the mantine-adapter's own Slider
    // classNames slots, translated to MUI's real classes slot names (root/rail/track/thumb/...).
    const callerClasses = restRecord.classes as
      | Partial<Record<string, string>>
      | undefined;
    const mergedClassNames = mergeClassNames(
      {
        root: styles.sliderRoot,
        rail: styles.sliderTrack,
        track: styles.sliderBar,
        thumb: styles.sliderThumb,
        mark: styles.sliderMark,
        markLabel: styles.sliderMarkLabel,
        valueLabel: styles.sliderTooltip,
      },
      callerClasses && {
        root: callerClasses.root,
        rail: callerClasses.track,
        track: callerClasses.bar,
        thumb: callerClasses.thumb,
        mark: callerClasses.mark,
        markLabel: callerClasses.markLabel,
      },
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
        error={!!error}
        required={required}
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
            data-suppress-focus-ring={suppressFocusRing ? "true" : undefined}
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
                step={step ?? undefined}
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
              <MuiSlider
                {...(sanitizedProps as unknown as MuiSliderProps)}
                classes={mergedClassNames}
                disabled={disabled}
                value={resolvedValue}
                onChange={handleValueChange}
                onMouseDown={handleThumbMouseDown}
                onFocus={handleThumbFocus}
                onBlur={handleThumbBlur}
                onKeyDown={handleThumbKeyDown}
                onChangeCommitted={
                  onChangeEnd as unknown as (
                    event: Event | React.SyntheticEvent,
                    value: number | number[],
                  ) => void
                }
                min={min}
                max={max}
                step={step}
                valueLabelDisplay={tooltipLabel === null ? "off" : "auto"}
                valueLabelFormat={
                  typeof tooltipLabel === "function"
                    ? (tooltipLabel as unknown as (
                        value: number,
                        index: number,
                      ) => React.ReactNode)
                    : undefined
                }
              />
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
                  step={step ?? undefined}
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
                  step={step ?? undefined}
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

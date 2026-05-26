import React, { forwardRef, useState, useEffect } from "react";
import {
  Slider as MuiSlider,
  type SliderProps as MuiSliderProps,
  type InputWrapperProps,
} from "@mui/material";
import { type ReadOnlyControlProps } from "@recursica/adapter-common";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import { type RecursicaFormControlWrapperProps } from "../FormControlWrapper/FormControlWrapper";
import { WithReadOnlyWrapper } from "../ReadOnlyField/WithReadOnlyWrapper";

import styles from "./Slider.module.css";

export interface RecursicaSliderProps
  extends Omit<
      Omit<MuiSliderProps, "size" | "color">,
      "variant" | "radius" | "wrapperProps" | "classNames" | "styles" | "label"
    >,
    Omit<
      RecursicaFormControlWrapperProps,
      "controlMaxWidth" | "controlMinWidth"
    >,
    Pick<InputWrapperProps, "error" | "required" | "withAsterisk">,
    ReadOnlyControlProps {
  /** The form control label displayed above or beside the slider track. */
  label?: React.ReactNode;
  /** Floating tooltip shown above the thumb when dragging. Replaces Mui's `label`. */
  tooltipLabel?: MuiSliderProps["label"];
  /** An optional icon rendered to the left of the slider track. */
  icon?: React.ReactNode;
  /** Whether to render a numeric input field side-by-side or stacked with the track. Defaults to false. */
  showInput?: boolean;
  /** Whether to render min and max labels below the track. Defaults to true. */
  showMinMaxLabels?: boolean;
}

export type SliderProps = RecursicaOverStyled<RecursicaSliderProps>;

/**
 * Custom Read-Only visual representation of the Slider value.
 * Utilizes component-specific read-only typography variables.
 */
const SliderReadOnlyValue: React.FC<{ value: number }> = ({ value }) => {
  return <div className={styles.readOnlyValue}>{value}</div>;
};

/**
 * Recursica Slider component wrapping Mui's Slider.
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

    const handleValueChange = (e: Event, val: number | number[]) => {
      const singleVal = Array.isArray(val) ? val[0] : val;
      if (value === undefined) {
        setInternalValue(singleVal);
      }
      onChange?.(singleVal as any);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const valStr = e.target.value;
      setInputValue(valStr);

      const parsed = parseFloat(valStr);
      if (!isNaN(parsed)) {
        // Clamp input value to bounds
        const clamped = Math.max(min, Math.min(max, parsed));
        handleValueChange(null as any, clamped);
      }
    };

    const handleInputBlur = () => {
      setInputValue(resolvedValue.toString());
    };

    const sanitizedProps = filterStylingProps(rest, overStyled);
    const restRecord = sanitizedProps as Record<string, unknown>;

    // Delete prohibited sizing hooks from bypassing variables natively
    delete restRecord["size"];
    delete restRecord["color"];
    delete restRecord["wrapperProps"];

    // Securely map core native blocks down ensuring nested CSS modules map precisely
    const mergedClassNames: Partial<Record<string, string>> = {
      root: styles.sliderRoot,
      rail: styles.sliderTrack,
      track: styles.sliderBar,
      thumb: styles.sliderThumb,
      mark: styles.sliderMark,
      markLabel: styles.sliderMarkLabel,
      valueLabel: styles.sliderTooltip,
    };

    const classNamesProp = restRecord.classNames;
    if (
      classNamesProp &&
      typeof classNamesProp === "object" &&
      !Array.isArray(classNamesProp)
    ) {
      const o = classNamesProp as Partial<Record<string, string>>;
      mergedClassNames.root = o.root
        ? `${styles.sliderRoot} ${o.root}`
        : styles.sliderRoot;
      mergedClassNames.rail = o.track
        ? `${styles.sliderTrack} ${o.track}`
        : styles.sliderTrack;
      mergedClassNames.track = o.bar
        ? `${styles.sliderBar} ${o.bar}`
        : styles.sliderBar;
      mergedClassNames.thumb = o.thumb
        ? `${styles.sliderThumb} ${o.thumb}`
        : styles.sliderThumb;
      mergedClassNames.mark = o.mark
        ? `${styles.sliderMark} ${o.mark}`
        : styles.sliderMark;
      mergedClassNames.markLabel = o.markLabel
        ? `${styles.sliderMarkLabel} ${o.markLabel}`
        : styles.sliderMarkLabel;
    }

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
              <MuiSlider
                classes={mergedClassNames}
                disabled={disabled}
                value={resolvedValue}
                onChange={handleValueChange}
                onChangeCommitted={onChangeEnd as any}
                min={min}
                max={max}
                step={step}
                valueLabelDisplay={tooltipLabel === null ? "off" : "auto"}
                valueLabelFormat={
                  typeof tooltipLabel === "function"
                    ? (tooltipLabel as any)
                    : undefined
                }
                {...(sanitizedProps as unknown as MuiSliderProps)}
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

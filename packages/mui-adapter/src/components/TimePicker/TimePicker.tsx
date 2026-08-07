import React, { forwardRef, useEffect, useMemo, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  TimePicker as MuiTimePicker,
  type TimePickerProps as MuiTimePickerProps,
} from "@mui/x-date-pickers/TimePicker";
import { Select, MenuItem, type SelectChangeEvent } from "@mui/material";
import dayjs, { type Dayjs } from "dayjs";
import { type ReadOnlyControlProps } from "@recursica/adapter-common";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import { type RecursicaFormControlWrapperProps } from "../FormControlWrapper/FormControlWrapper";
import { WithReadOnlyWrapper } from "../ReadOnlyField/WithReadOnlyWrapper";
import styles from "./TimePicker.module.css";

import { type RecursicaTimePickerProps as BaseRecursicaTimePickerProps } from "@recursica/adapter-common";

const TIME_FORMAT_SECONDS = "HH:mm:ss";
const TIME_FORMAT_MINUTES = "HH:mm";

/** Parses a Recursica "HH:mm" / "HH:mm:ss" string into a Dayjs instance, or undefined if not set. */
function toDayjs(value: string | undefined): Dayjs | undefined {
  if (!value) return undefined;
  const format = value.length > 5 ? TIME_FORMAT_SECONDS : TIME_FORMAT_MINUTES;
  return dayjs(value, format);
}

export interface RecursicaTimePickerProps
  extends Omit<
      MuiTimePickerProps,
      | "value"
      | "defaultValue"
      | "onChange"
      | "minTime"
      | "maxTime"
      | "views"
      | "format"
      | "style"
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
    BaseRecursicaTimePickerProps {
  /** Selected time as an "HH:mm" (or "HH:mm:ss" with `withSeconds`) string, matching the mantine-adapter convention. */
  value?: string;
  /** Uncontrolled initial time as an "HH:mm" (or "HH:mm:ss" with `withSeconds`) string. */
  defaultValue?: string;
  /** Fires with the new time as an "HH:mm" (or "HH:mm:ss" with `withSeconds`) string, or `null` if cleared. */
  onChange?: (value: string | null) => void;
  /** Caller-provided inline style, passed through to the FormControlWrapper root. */
  style?: React.CSSProperties;
}

export type TimePickerProps = RecursicaOverStyled<RecursicaTimePickerProps>;

export const TimePicker = forwardRef<HTMLDivElement, TimePickerProps>(
  function TimePicker(props, ref) {
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
      onChange,
      withSeconds,
      minTime,
      maxTime,
      hideAmPm = false,
      ...rest
    } = props;

    const sanitizedProps = filterStylingProps(rest, overStyled);
    const timeFormat = withSeconds ? TIME_FORMAT_SECONDS : TIME_FORMAT_MINUTES;

    // Internal full 24-hour value. Needed (unlike every other component in this adapter) because
    // hideAmPm={false} splits entry across two separate controls (the time field + the AM/PM
    // select) that both mutate the same conceptual value — see TIMEPICKER_IMPLEMENTATION_NOTES.md.
    const [internalValue, setInternalValue] = useState<Dayjs | null>(
      () => toDayjs(value) ?? toDayjs(defaultValue) ?? null,
    );

    useEffect(() => {
      if (value !== undefined) {
        setInternalValue(toDayjs(value) ?? null);
      }
    }, [value]);

    const isPM = useMemo(
      () => (internalValue ? internalValue.hour() >= 12 : false),
      [internalValue],
    );

    const wrapperClass = className
      ? `${styles.layoutOverride} ${className}`
      : styles.layoutOverride;

    const emitChange = (next: Dayjs | null) => {
      setInternalValue(next);
      onChange?.(next ? next.format(timeFormat) : null);
    };

    const handleFieldChange = (next: Dayjs | null) => {
      emitChange(next);
    };

    const handleMeridiemChange = (event: SelectChangeEvent) => {
      if (!internalValue) return;
      const wantsPM = event.target.value === "PM";
      const currentHour = internalValue.hour();
      const currentlyPM = currentHour >= 12;
      if (wantsPM === currentlyPM) return;
      const nextHour = wantsPM ? currentHour + 12 : currentHour - 12;
      emitChange(internalValue.hour(nextHour));
    };

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
          /* Naked field execution safely decoupled from MUI X's own label/error macro handling.
             hideAmPm={false} (default) renders a 12-hour field (no native meridiem section) plus a
             separate AM/PM <Select> — a Recursica-specific composite; see USAGE.md and
             TIMEPICKER_IMPLEMENTATION_NOTES.md for why this isn't Recursica's own Dropdown component. */
          <div className={styles.root} data-error={error ? "true" : undefined}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MuiTimePicker
                value={internalValue}
                onChange={handleFieldChange}
                disabled={disabled}
                format={
                  hideAmPm ? timeFormat : `hh:${withSeconds ? "mm:ss" : "mm"}`
                }
                views={
                  withSeconds
                    ? ["hours", "minutes", "seconds"]
                    : ["hours", "minutes"]
                }
                minTime={toDayjs(minTime)}
                maxTime={toDayjs(maxTime)}
                slotProps={{
                  field: {
                    className: styles.field,
                  },
                }}
                {...(sanitizedProps as unknown as Partial<MuiTimePickerProps>)}
              />
            </LocalizationProvider>
            {!hideAmPm && (
              <Select
                className={styles.amPmSelect}
                value={isPM ? "PM" : "AM"}
                onChange={handleMeridiemChange}
                disabled={disabled}
                variant="standard"
                aria-label="AM or PM"
              >
                <MenuItem value="AM">AM</MenuItem>
                <MenuItem value="PM">PM</MenuItem>
              </Select>
            )}
          </div>
        }
      />
    );
  },
);

TimePicker.displayName = "TimePicker";

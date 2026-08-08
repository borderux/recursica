import React, { forwardRef, useEffect, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  TimePicker as MuiTimePicker,
  type TimePickerProps as MuiTimePickerProps,
} from "@mui/x-date-pickers/TimePicker";
import dayjs, { type Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { type ReadOnlyControlProps } from "@recursica/adapter-common";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import { type RecursicaFormControlWrapperProps } from "../FormControlWrapper/FormControlWrapper";
import { WithReadOnlyWrapper } from "../ReadOnlyField/WithReadOnlyWrapper";
import { BareDropdown } from "../Dropdown/BareDropdown";
import styles from "./TimePicker.module.css";

import { type RecursicaTimePickerProps as BaseRecursicaTimePickerProps } from "@recursica/adapter-common";

// Required for dayjs's 2-arg `dayjs(value, format)` string-parsing signature used by `toDayjs`
// below — without this, dayjs silently ignores the format string and falls back to native `Date`
// parsing, which fails on a bare "HH:mm" time string (no date component) and returns an Invalid
// Date. This went unnoticed until a real initial `value`/`defaultValue` needed parsing (every
// interactive test before that produced Dayjs objects directly from the field's own onChange,
// never exercising this path).
dayjs.extend(customParseFormat);

const TIME_FORMAT_SECONDS = "HH:mm:ss";
const TIME_FORMAT_MINUTES = "HH:mm";
const AM_PM_DATA = [
  { value: "AM", label: "AM" },
  { value: "PM", label: "PM" },
];

/** Parses a Recursica "HH:mm" / "HH:mm:ss" string into a Dayjs instance, or undefined if not set. */
function toDayjs(value: string | undefined): Dayjs | undefined {
  if (!value) return undefined;
  const format = value.length > 5 ? TIME_FORMAT_SECONDS : TIME_FORMAT_MINUTES;
  return dayjs(value, format);
}

/**
 * Formats an "HH:mm"/"HH:mm:ss" 24-hour value as a 12-hour + AM/PM string for read-only display
 * (e.g. "14:30" -> "2:30 PM") — the raw 24-hour string was being shown as-is in read-only mode,
 * with no AM/PM, unlike the interactive composite. Returns undefined if not parseable.
 */
function formatReadOnlyTime(value: string | undefined): string | undefined {
  const parsed = toDayjs(value);
  if (!parsed) return value;
  return parsed.format(value && value.length > 5 ? "h:mm:ss A" : "h:mm A");
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
      ...rest
    } = props;

    const sanitizedProps = filterStylingProps(rest, overStyled);

    // Internal full 24-hour value. Needed (unlike every other component in this adapter) because
    // the time field and the AM/PM BareDropdown both mutate the same conceptual value — see
    // TIMEPICKER_IMPLEMENTATION_NOTES.md.
    const [internalValue, setInternalValue] = useState<Dayjs | null>(
      () => toDayjs(value) ?? toDayjs(defaultValue) ?? null,
    );

    useEffect(() => {
      if (value !== undefined) {
        setInternalValue(toDayjs(value) ?? null);
      }
    }, [value]);

    const isPM = internalValue ? internalValue.hour() >= 12 : false;

    const wrapperClass = className
      ? `${styles.layoutOverride} ${className}`
      : styles.layoutOverride;

    const emitChange = (next: Dayjs | null) => {
      setInternalValue(next);
      onChange?.(
        next
          ? next.format(withSeconds ? TIME_FORMAT_SECONDS : TIME_FORMAT_MINUTES)
          : null,
      );
    };

    const handleFieldChange = (next: Dayjs | null) => {
      emitChange(next);
    };

    const handleMeridiemChange = (next: string | null) => {
      if (!internalValue || !next) return;
      const wantsPM = next === "PM";
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
        readOnlyValue={formatReadOnlyTime(
          value !== undefined ? value : defaultValue,
        )}
        readOnlyNativeProps={props}
        activeComponent={
          /* Naked field execution safely decoupled from MUI X's own label/error macro handling.
             format="hh:mm" is always on (12-hour digits, no native meridiem section) — this is the
             only way this component operates, not a user choice. The AM/PM BareDropdown next to it
             is the only AM/PM control; see TIMEPICKER_IMPLEMENTATION_NOTES.md. */
          <div className={styles.root} data-error={error ? "true" : undefined}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MuiTimePicker
                value={internalValue}
                onChange={handleFieldChange}
                disabled={disabled}
                format={`hh:${withSeconds ? "mm:ss" : "mm"}`}
                views={
                  withSeconds
                    ? ["hours", "minutes", "seconds"]
                    : ["hours", "minutes"]
                }
                minTime={toDayjs(minTime)}
                maxTime={toDayjs(maxTime)}
                // No icon/open-picker button: time-picker's own token schema has no icon slot (see
                // EXEMPTIONS above), and the popup clock/list view this button opens isn't styled
                // to Recursica tokens anyway (see TIMEPICKER_IMPLEMENTATION_NOTES.md) — showing an
                // affordance to open an unstyled popup would be worse than not showing one. Typing
                // directly into the field's masked hour/minute segments is the only interaction.
                slots={{ openPickerButton: () => null }}
                slotProps={{
                  field: {
                    className: styles.field,
                  },
                }}
                {...(sanitizedProps as unknown as Partial<MuiTimePickerProps>)}
              />
            </LocalizationProvider>
            <BareDropdown
              overStyled
              className={styles.amPmSelect}
              // Dropdown.module.css's own .root sets width: 100% (correct for a standalone
              // Dropdown filling its form-control column) — overStyled lets us override just the
              // width via inline style, keeping every other Recursica style (border, colors,
              // padding) intact. See TIMEPICKER_IMPLEMENTATION_NOTES.md.
              style={{ width: "fit-content" }}
              data={AM_PM_DATA}
              value={isPM ? "PM" : "AM"}
              onChange={handleMeridiemChange}
              disabled={disabled}
              error={!!error}
              aria-label="AM or PM"
            />
          </div>
        }
      />
    );
  },
);

TimePicker.displayName = "TimePicker";

import React, { forwardRef, useEffect, useRef, useState } from "react";
import {
  TimePicker as MantineTimePicker,
  type TimePickerProps as MantineTimePickerProps,
} from "@mantine/dates";
import { type InputWrapperProps } from "@mantine/core";
import { type ReadOnlyControlProps } from "@recursica/adapter-common";
import {
  filterStylingProps,
  omitUnsupportedProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import { type RecursicaFormControlWrapperProps } from "../FormControlWrapper/FormControlWrapper";
import { WithReadOnlyWrapper } from "../ReadOnlyField/WithReadOnlyWrapper";
import { BareDropdown } from "../Dropdown/BareDropdown";
import styles from "./TimePicker.module.css";

import { type RecursicaTimePickerProps as BaseRecursicaTimePickerProps } from "@recursica/adapter-common";

const AM_PM_DATA = [
  { value: "AM", label: "AM" },
  { value: "PM", label: "PM" },
];

/** Parses an "HH:mm"/"HH:mm:ss" string's hour, or undefined if not set/parseable. */
function getHour(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const hour = parseInt(value.slice(0, 2), 10);
  return Number.isNaN(hour) ? undefined : hour;
}

/** Replaces the hour segment of an "HH:mm"/"HH:mm:ss" string, preserving minutes/seconds. */
function withHour(value: string, hour: number): string {
  return `${String(hour).padStart(2, "0")}${value.slice(2)}`;
}

/**
 * Formats an "HH:mm"/"HH:mm:ss" 24-hour value as a 12-hour + AM/PM string for read-only display
 * (e.g. "14:30" -> "2:30 PM") — the raw 24-hour string was being shown as-is in read-only mode,
 * with no AM/PM, unlike the interactive composite. Returns undefined if not parseable.
 */
function formatReadOnlyTime(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const [hourStr, minute, second] = value.split(":");
  const hour24 = parseInt(hourStr, 10);
  if (Number.isNaN(hour24) || minute === undefined) return value;
  const isPM = hour24 >= 12;
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  const rest = second !== undefined ? `${minute}:${second}` : minute;
  return `${hour12}:${rest} ${isPM ? "PM" : "AM"}`;
}

/**
 * Simulates a real user interaction on Mantine's own (CSS-hidden) native AM/PM <select>, since it's
 * a React-controlled element — setting `.value` directly and dispatching a plain DOM event doesn't
 * trigger React's change handling; using the native property setter first does. See "Why AM/PM is
 * seeded on mount" in TIMEPICKER_IMPLEMENTATION_NOTES.md.
 */
function setNativeSelectValue(el: HTMLSelectElement, value: string): void {
  const nativeSetter = Object.getOwnPropertyDescriptor(
    window.HTMLSelectElement.prototype,
    "value",
  )?.set;
  nativeSetter?.call(el, value);
  el.dispatchEvent(new Event("change", { bubbles: true }));
}

export interface RecursicaTimePickerProps
  extends Omit<
      MantineTimePickerProps,
      | "size"
      | "variant"
      | "radius"
      | "wrapperProps"
      | "format"
      | "min"
      | "max"
      // AM/PM is always shown via our own BareDropdown, driving a fixed 12h format — these all
      // control Mantine's own native (now CSS-hidden) AM/PM select and would be misleading to
      // expose, since they'd have no visible effect. See TIMEPICKER_IMPLEMENTATION_NOTES.md.
      | "amPmInputLabel"
      | "amPmLabels"
      | "amPmSelectProps"
      | "amPmRef"
      // The optional time-presets dropdown isn't wired up; keep the public API to what's supported.
      | "withDropdown"
      | "presets"
      | "maxDropdownContentHeight"
      | "scrollAreaProps"
      | "reverseTimeControlsList"
      | "popoverProps"
    >,
    Pick<
      InputWrapperProps,
      "label" | "error" | "required" | "withAsterisk" | "id"
    >,
    Omit<
      RecursicaFormControlWrapperProps,
      "controlMaxWidth" | "controlMinWidth"
    >,
    ReadOnlyControlProps,
    BaseRecursicaTimePickerProps {}

export type TimePickerProps = RecursicaOverStyled<RecursicaTimePickerProps>;

// Props this component intentionally doesn't support — deleted at runtime so they can't leak
// through even if a caller forces them via plain JavaScript, bypassing the `Omit<>` above.
const UNSUPPORTED_PROPS = [
  "size", // Recursica controls sizing via the `size` variant + design tokens, not raw dimensions.
  "variant", // Colors/variants are token-driven; the library's native palette isn't exposed.
  "radius", // Recursica does not expose the library's native corner-radius system.
] as const satisfies readonly (keyof MantineTimePickerProps)[];

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
      onChange,
      withSeconds,
      minTime,
      maxTime,
      ...rest
    } = props;

    const sanitizedProps = omitUnsupportedProps(
      filterStylingProps(rest, overStyled) as Record<string, unknown>,
      UNSUPPORTED_PROPS,
    );

    // Internal full 24-hour value. Needed because Mantine's TimePicker (hour/minute/second entry)
    // and our own BareDropdown (AM/PM) both mutate the same conceptual value — see
    // TIMEPICKER_IMPLEMENTATION_NOTES.md.
    const [internalValue, setInternalValue] = useState<string | undefined>(
      () => value ?? defaultValue,
    );

    useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value);
      }
    }, [value]);

    // Mantine's own internal amPm state starts `null` whenever there's no initial hour to derive it
    // from (see convertTimeTo12HourFormat in @mantine/dates), and it stays null — meaning Mantine
    // never reports a valid onChange, no matter what's typed — until something interacts with the
    // (CSS-hidden) native AM/PM <select>. Simulating that interaction once on mount, defaulting to
    // AM, breaks the deadlock: a freshly-typed time now resolves and reports immediately, and our
    // own BareDropdown (which drives the same native select the same way, see handleMeridiemChange)
    // correctly displays and changes it from there. Skipped whenever a real initial value/defaultValue
    // is already present — Mantine already derives the correct AM/PM from that on its own. See
    // TIMEPICKER_IMPLEMENTATION_NOTES.md.
    const amPmRef = useRef<HTMLSelectElement>(null);
    useEffect(() => {
      if (getHour(value ?? defaultValue) === undefined && amPmRef.current) {
        setNativeSelectValue(amPmRef.current, "AM");
      }
      // Intentionally mount-only — this seeds Mantine's internal state once; after that it's driven
      // by real interaction (typing, or our own BareDropdown).
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const emitChange = (next: string) => {
      setInternalValue(next);
      onChange?.(next);
    };

    const hour = getHour(internalValue);
    const isPM = hour !== undefined && hour >= 12;

    const handleFieldChange = (next: string) => {
      emitChange(next);
    };

    const handleMeridiemChange = (next: string | null) => {
      if (hour === undefined || !internalValue || !next) return;
      const wantsPM = next === "PM";
      if (wantsPM === isPM) return;
      const nextHour = wantsPM ? hour + 12 : hour - 12;
      emitChange(withHour(internalValue, nextHour));
    };

    const wrapperClass = className
      ? `${styles.layoutOverride} ${className}`
      : styles.layoutOverride;

    return (
      <WithReadOnlyWrapper
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
        withAsterisk={withAsterisk}
        id={id}
        readOnly={readOnly}
        readOnlyComponent={readOnlyComponent}
        emptyValueComponent={emptyValueComponent}
        readOnlyType="text"
        readOnlyValue={formatReadOnlyTime(
          value !== undefined ? value : defaultValue,
        )}
        readOnlyNativeProps={props}
        activeComponent={
          /* Naked field execution safely decoupled from Mantine's macro Input.Wrapper DOM hooks.
             format="12h" is always on — this is the only way this component operates, not a user
             choice (see TIMEPICKER_IMPLEMENTATION_NOTES.md). Mantine's own native AM/PM <select>
             (bundled unconditionally with format="12h") is CSS-hidden; our own BareDropdown next to
             it is the only AM/PM control the user interacts with. */
          <div
            className={styles.root}
            data-disabled={disabled ? "true" : undefined}
            data-error={error ? "true" : undefined}
          >
            <MantineTimePicker
              ref={ref}
              {...(sanitizedProps as unknown as MantineTimePickerProps)}
              classNames={{
                wrapper: styles.timeWrapper,
                input: styles.timeInput,
                fieldsGroup: styles.fieldsGroup,
                field: styles.timeField,
              }}
              disabled={disabled}
              value={internalValue}
              onChange={handleFieldChange}
              format="12h"
              withSeconds={withSeconds}
              min={minTime}
              max={maxTime}
              withDropdown={false}
              // Internal-only — not part of the public API (see the Omit list above) — used solely
              // to seed the mount-time AM default onto Mantine's own hidden native select. See
              // TIMEPICKER_IMPLEMENTATION_NOTES.md.
              amPmRef={amPmRef}
            />
            <BareDropdown
              overStyled
              className={styles.amPmSelect}
              // Dropdown.module.css's own .root sets width: 100% (correct for a standalone
              // Dropdown filling its form-control column) — overStyled lets us override just the
              // width, keeping every other Recursica style (border, colors, padding) intact.
              // A plain `style` prop won't do this: Mantine's Select/InputBase internals
              // (useInputProps) route a top-level `style` prop to the *label* InputWrapper, not
              // the bordered input box itself — `styles={{ wrapper: ... }}` is the styles-api hook
              // that actually targets that box. See TIMEPICKER_IMPLEMENTATION_NOTES.md.
              styles={{ wrapper: { width: "fit-content" } }}
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

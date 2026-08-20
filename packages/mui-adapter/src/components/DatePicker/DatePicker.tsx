import React, { forwardRef, useEffect, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  DatePicker as MuiDatePicker,
  type DatePickerProps as MuiDatePickerProps,
  type DatePickerSlotProps,
  type DatePickerSlots,
} from "@mui/x-date-pickers/DatePicker";
import dayjs, { type Dayjs } from "dayjs";
import { type ReadOnlyControlProps } from "@recursica/adapter-common";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import { type RecursicaFormControlWrapperProps } from "../FormControlWrapper/FormControlWrapper";
import { WithReadOnlyWrapper } from "../ReadOnlyField/WithReadOnlyWrapper";
import { CalendarIcon } from "./DatePicker.icons";
import styles from "./DatePicker.module.css";

import { type RecursicaDatePickerProps as BaseRecursicaDatePickerProps } from "@recursica/adapter-common";

// Default display/entry format (dayjs format string), matching the mantine-adapter's DatePicker.
const DATE_FORMAT = "MM/DD/YY";

function toDayjs(value: Date | null | undefined): Dayjs | null {
  return value ? dayjs(value) : null;
}

export interface RecursicaDatePickerProps
  extends Omit<
      MuiDatePickerProps,
      | "value"
      | "defaultValue"
      | "onChange"
      | "minDate"
      | "maxDate"
      | "format"
      | "slots"
      | "slotProps"
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
    BaseRecursicaDatePickerProps {
  /** Selected date, matching the mantine-adapter convention of a plain `Date` value. */
  value?: Date | null;
  /** Uncontrolled initial date. */
  defaultValue?: Date | null;
  /** Fires with the new date, or `null` if cleared. */
  onChange?: (value: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  /** Overridable component slots — e.g. `slots={{ openPickerIcon: MyIcon }}` to replace the default calendar icon. */
  slots?: DatePickerSlots;
  slotProps?: DatePickerSlotProps;
  /** Caller-provided inline style, passed through to the FormControlWrapper root. */
  style?: React.CSSProperties;
}

export type DatePickerProps = RecursicaOverStyled<RecursicaDatePickerProps>;

export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  function DatePicker(props, ref) {
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
      minDate,
      maxDate,
      slots,
      slotProps,
      ...rest
    } = props;

    const sanitizedProps = filterStylingProps(rest, overStyled);

    // Internal Dayjs value: MUI X's DatePicker only speaks Dayjs (via AdapterDayjs); the public
    // API stays plain `Date` to match the mantine-adapter convention.
    const [internalValue, setInternalValue] = useState<Dayjs | null>(
      () => toDayjs(value) ?? toDayjs(defaultValue) ?? null,
    );

    useEffect(() => {
      if (value !== undefined) {
        setInternalValue(toDayjs(value));
      }
    }, [value]);

    const wrapperClass = className
      ? `${styles.layoutOverride} ${className}`
      : styles.layoutOverride;

    const handleChange = (next: Dayjs | null) => {
      setInternalValue(next);
      onChange?.(next ? next.toDate() : null);
    };

    const readOnlyValue = (() => {
      const source = value !== undefined ? value : defaultValue;
      return toDayjs(source)?.format(DATE_FORMAT);
    })();

    // slotProps.field/desktopPaper are typed to also allow a `(ownerState) => props` function
    // form; this adapter only ever merges plain objects (same assumption TextField/DatePicker's
    // mantine counterpart make for consumer-supplied classNames), so narrow to that shape here.
    const consumerFieldProps =
      slotProps?.field && typeof slotProps.field === "object"
        ? (slotProps.field as Record<string, unknown>)
        : undefined;
    const consumerDesktopPaperProps =
      slotProps?.desktopPaper && typeof slotProps.desktopPaper === "object"
        ? (slotProps.desktopPaper as Record<string, unknown>)
        : undefined;

    return (
      <WithReadOnlyWrapper
        ref={ref}
        className={wrapperClass}
        style={style}
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
        readOnlyValue={readOnlyValue}
        readOnlyNativeProps={props}
        activeComponent={
          /* Naked field execution safely decoupled from MUI X's own label/error macro handling,
             same convention as TimePicker.tsx. Unlike TimePicker, the popup calendar IS used here
             (and token-styled below) — see DATEPICKER_IMPLEMENTATION_NOTES.md. */
          <div className={styles.root} data-error={error ? "true" : undefined}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MuiDatePicker
                {...(sanitizedProps as unknown as Partial<MuiDatePickerProps>)}
                value={internalValue}
                onChange={handleChange}
                disabled={disabled}
                format={DATE_FORMAT}
                minDate={toDayjs(minDate) ?? undefined}
                maxDate={toDayjs(maxDate) ?? undefined}
                slots={{ openPickerIcon: CalendarIcon, ...slots }}
                slotProps={
                  {
                    ...slotProps,
                    field: {
                      // Calendar icon opens the picker from the left side of the field, mirroring
                      // the mantine-adapter's default `leftSection`; overridable via
                      // `slots.openPickerIcon`. Only settable per-field, not at the picker's own
                      // top level (MUI X has no top-level `openPickerButtonPosition` prop).
                      openPickerButtonPosition: "start",
                      ...consumerFieldProps,
                      className: consumerFieldProps?.className
                        ? `${styles.field} ${consumerFieldProps.className as string}`
                        : styles.field,
                    },
                    // The popup surface is portaled to document.body, outside this component's own
                    // DOM subtree, so — same constraint mantine-adapter's `popoverProps.classNames`
                    // documents — it can only be reached by handing it a className directly, not a
                    // descendant CSS selector.
                    desktopPaper: {
                      ...consumerDesktopPaperProps,
                      className: consumerDesktopPaperProps?.className
                        ? `${styles.dropdown} ${consumerDesktopPaperProps.className as string}`
                        : styles.dropdown,
                    },
                  } as DatePickerSlotProps
                }
              />
            </LocalizationProvider>
          </div>
        }
      />
    );
  },
);

DatePicker.displayName = "DatePicker";

/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import "./DatePicker.module.css";
import { type RecursicaDatePickerProps } from "@recursica/adapter-common";

export type DatePickerProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "value" | "onChange" | "defaultValue"
> &
  RecursicaDatePickerProps & {
    disabled?: boolean;
    label?: React.ReactNode;
    assistiveText?: string;
    error?: React.ReactNode;
    required?: boolean;
    withAsterisk?: boolean;
    placeholder?: string;
    value?: Date | null;
    defaultValue?: Date | null;
    onChange?: (value: Date | null) => void;
    readOnly?: boolean;
    formLayout?: "stacked" | "side-by-side";
    leftSection?: React.ReactNode;
    labelWithEditIcon?: boolean;
    onLabelEditClick?: () => void;
  };

export const DatePicker: React.FC<DatePickerProps> = ({
  disabled,
  label,
  assistiveText,
  error,
  required,
  withAsterisk,
  placeholder,
  value,
  defaultValue,
  onChange,
  readOnly,
  formLayout,
  leftSection,
  labelWithEditIcon,
  onLabelEditClick,
  ...props
}) => {
  return <div {...props}>DatePicker</div>;
};

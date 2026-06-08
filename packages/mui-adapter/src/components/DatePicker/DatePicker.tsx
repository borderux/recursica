import React from "react";
import "./DatePicker.module.css";
import { type RecursicaDatePickerProps } from "@recursica/adapter-common";

export type DatePickerProps = React.HTMLAttributes<HTMLDivElement> &
  RecursicaDatePickerProps;

export const DatePicker: React.FC<DatePickerProps> = (props) => {
  return <div {...props}>DatePicker</div>;
};

import React from "react";
import "./DatePicker.module.css";

export type DatePickerProps = React.HTMLAttributes<HTMLDivElement>;

export const DatePicker: React.FC<DatePickerProps> = (props) => {
  return <div {...props}>DatePicker</div>;
};

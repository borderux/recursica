import React from "react";
import "./TimePicker.module.css";

export type TimePickerProps = React.HTMLAttributes<HTMLDivElement>;

export const TimePicker: React.FC<TimePickerProps> = (props) => {
  return <div {...props}>TimePicker</div>;
};

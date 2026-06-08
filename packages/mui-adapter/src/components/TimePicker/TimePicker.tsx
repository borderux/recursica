import React from "react";
import "./TimePicker.module.css";
import { type RecursicaTimePickerProps } from "@recursica/adapter-common";

export type TimePickerProps = React.HTMLAttributes<HTMLDivElement> &
  RecursicaTimePickerProps;

export const TimePicker: React.FC<TimePickerProps> = (props) => {
  return <div {...props}>TimePicker</div>;
};

import React from "react";
import { type RecursicaTimePickerProps } from "@recursica/adapter-common";

export type TimePickerProps = React.HTMLAttributes<HTMLDivElement> &
  RecursicaTimePickerProps;

export const TimePicker: React.FC<TimePickerProps> = (props) => {
  return <div {...props}>TimePicker</div>;
};

import React from "react";

export type TimePickerProps = React.HTMLAttributes<HTMLDivElement>;

export const TimePicker: React.FC<TimePickerProps> = (props) => {
  return <div {...props}>TimePicker</div>;
};

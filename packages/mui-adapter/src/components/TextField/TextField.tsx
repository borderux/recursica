import React from "react";
import "./TextField.module.css";

export type TextFieldProps = React.HTMLAttributes<HTMLDivElement>;

export const TextField: React.FC<TextFieldProps> = (props) => {
  return <div {...props}>TextField</div>;
};

import React from "react";
import "./NumberInput.module.css";

export type NumberInputProps = React.HTMLAttributes<HTMLDivElement>;

export const NumberInput: React.FC<NumberInputProps> = (props) => {
  return <div {...props}>NumberInput</div>;
};

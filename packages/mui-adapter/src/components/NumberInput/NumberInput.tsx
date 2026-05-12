import React from "react";

export type NumberInputProps = React.HTMLAttributes<HTMLDivElement>;

export const NumberInput: React.FC<NumberInputProps> = (props) => {
  return <div {...props}>NumberInput</div>;
};

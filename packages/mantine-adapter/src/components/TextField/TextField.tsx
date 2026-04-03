import React from "react";

export type TextFieldProps = React.HTMLAttributes<HTMLDivElement>;

export const TextField: React.FC<TextFieldProps> = (props) => {
  return <div {...props}>TextField</div>;
};

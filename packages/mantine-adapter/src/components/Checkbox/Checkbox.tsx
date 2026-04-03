import React from "react";

export type CheckboxProps = React.HTMLAttributes<HTMLDivElement>;

export const Checkbox: React.FC<CheckboxProps> = (props) => {
  return <div {...props}>Checkbox</div>;
};

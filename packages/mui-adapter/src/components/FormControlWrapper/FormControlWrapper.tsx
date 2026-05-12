import React from "react";

export type FormControlWrapperProps = React.HTMLAttributes<HTMLDivElement>;

export const FormControlWrapper: React.FC<FormControlWrapperProps> = (
  props,
) => {
  return <div {...props}>FormControlWrapper</div>;
};

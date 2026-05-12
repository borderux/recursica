import React from "react";

export type ButtonProps = React.HTMLAttributes<HTMLDivElement>;

export const Button: React.FC<ButtonProps> = (props) => {
  return <div {...props}>Button</div>;
};

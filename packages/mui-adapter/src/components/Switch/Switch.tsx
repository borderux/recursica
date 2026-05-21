import React from "react";
import "./Switch.module.css";

export type SwitchProps = React.HTMLAttributes<HTMLDivElement>;

export const Switch: React.FC<SwitchProps> = (props) => {
  return <div {...props}>Switch</div>;
};

import React from "react";

export type SwitchProps = React.HTMLAttributes<HTMLDivElement>;

export const Switch: React.FC<SwitchProps> = (props) => {
  return <div {...props}>Switch</div>;
};

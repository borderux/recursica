import React from "react";

export type TooltipProps = React.HTMLAttributes<HTMLDivElement>;

export const Tooltip: React.FC<TooltipProps> = (props) => {
  return <div {...props}>Tooltip</div>;
};

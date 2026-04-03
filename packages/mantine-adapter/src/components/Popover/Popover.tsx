import React from "react";

export type PopoverProps = React.HTMLAttributes<HTMLDivElement>;

export const Popover: React.FC<PopoverProps> = (props) => {
  return <div {...props}>Popover</div>;
};

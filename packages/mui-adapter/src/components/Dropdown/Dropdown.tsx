import React from "react";

export type DropdownProps = React.HTMLAttributes<HTMLDivElement>;

export const Dropdown: React.FC<DropdownProps> = (props) => {
  return <div {...props}>Dropdown</div>;
};

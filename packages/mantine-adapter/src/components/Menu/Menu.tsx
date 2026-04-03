import React from "react";

export type MenuProps = React.HTMLAttributes<HTMLDivElement>;

export const Menu: React.FC<MenuProps> = (props) => {
  return <div {...props}>Menu</div>;
};

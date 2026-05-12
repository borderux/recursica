import React from "react";

export type BadgeProps = React.HTMLAttributes<HTMLDivElement>;

export const Badge: React.FC<BadgeProps> = (props) => {
  return <div {...props}>Badge</div>;
};

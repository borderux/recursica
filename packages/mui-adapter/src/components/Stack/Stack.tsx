import React from "react";

export type StackProps = React.HTMLAttributes<HTMLDivElement>;

export const Stack: React.FC<StackProps> = (props) => {
  return <div {...props}>Stack</div>;
};

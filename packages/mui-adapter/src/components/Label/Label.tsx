import React from "react";

export type LabelProps = React.HTMLAttributes<HTMLDivElement>;

export const Label: React.FC<LabelProps> = (props) => {
  return <div {...props}>Label</div>;
};

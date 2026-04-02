import React from "react";

export type PanelProps = React.HTMLAttributes<HTMLDivElement>;

export const Panel: React.FC<PanelProps> = (props) => {
  return <div {...props}>Panel</div>;
};

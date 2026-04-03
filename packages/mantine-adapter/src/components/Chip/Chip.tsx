import React from "react";

export type ChipProps = React.HTMLAttributes<HTMLDivElement>;

export const Chip: React.FC<ChipProps> = (props) => {
  return <div {...props}>Chip</div>;
};

import React from "react";
import "./Chip.module.css";

export type ChipProps = React.HTMLAttributes<HTMLDivElement>;

export const Chip: React.FC<ChipProps> = (props) => {
  return <div {...props}>Chip</div>;
};

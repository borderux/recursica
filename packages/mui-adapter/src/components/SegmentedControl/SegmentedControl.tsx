import React from "react";
import "./SegmentedControl.module.css";

export type SegmentedControlProps = React.HTMLAttributes<HTMLDivElement>;

export const SegmentedControl: React.FC<SegmentedControlProps> = (props) => {
  return <div {...props}>SegmentedControl</div>;
};

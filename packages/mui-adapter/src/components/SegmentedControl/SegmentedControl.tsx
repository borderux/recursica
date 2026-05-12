import React from "react";

export type SegmentedControlProps = React.HTMLAttributes<HTMLDivElement>;

export const SegmentedControl: React.FC<SegmentedControlProps> = (props) => {
  return <div {...props}>SegmentedControl</div>;
};

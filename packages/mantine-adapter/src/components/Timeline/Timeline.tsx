import React from "react";

export type TimelineProps = React.HTMLAttributes<HTMLDivElement>;

export const Timeline: React.FC<TimelineProps> = (props) => {
  return <div {...props}>Timeline</div>;
};

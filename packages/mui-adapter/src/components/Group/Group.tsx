import React from "react";

export type GroupProps = React.HTMLAttributes<HTMLDivElement>;

export const Group: React.FC<GroupProps> = (props) => {
  return <div {...props}>Group</div>;
};

import React from "react";

export type TableProps = React.HTMLAttributes<HTMLDivElement>;

export const Table: React.FC<TableProps> = (props) => {
  return <div {...props}>Table</div>;
};

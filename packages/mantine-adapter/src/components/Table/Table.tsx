import React from "react";
import { type RecursicaTableProps } from "@recursica/adapter-common";

export type TableProps = React.HTMLAttributes<HTMLDivElement> &
  RecursicaTableProps;

export const Table: React.FC<TableProps> = (props) => {
  return <div {...props}>Table</div>;
};

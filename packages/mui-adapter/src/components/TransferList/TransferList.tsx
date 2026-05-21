import React from "react";
import "./TransferList.module.css";

export type TransferListProps = React.HTMLAttributes<HTMLDivElement>;

export const TransferList: React.FC<TransferListProps> = (props) => {
  return <div {...props}>TransferList</div>;
};

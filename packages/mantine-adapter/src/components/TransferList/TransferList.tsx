import React from "react";
import { type RecursicaTransferListProps } from "@recursica/adapter-common";

export type TransferListProps = React.HTMLAttributes<HTMLDivElement> &
  RecursicaTransferListProps;

export const TransferList: React.FC<TransferListProps> = (props) => {
  return <div {...props}>TransferList</div>;
};

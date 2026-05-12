import React from "react";

export type TransferListProps = React.HTMLAttributes<HTMLDivElement>;

export const TransferList: React.FC<TransferListProps> = (props) => {
  return <div {...props}>TransferList</div>;
};

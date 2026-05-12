import React from "react";

export type PaginationProps = React.HTMLAttributes<HTMLDivElement>;

export const Pagination: React.FC<PaginationProps> = (props) => {
  return <div {...props}>Pagination</div>;
};

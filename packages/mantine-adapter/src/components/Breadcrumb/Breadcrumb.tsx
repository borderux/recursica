import React from "react";

export type BreadcrumbProps = React.HTMLAttributes<HTMLDivElement>;

export const Breadcrumb: React.FC<BreadcrumbProps> = (props) => {
  return <div {...props}>Breadcrumb</div>;
};

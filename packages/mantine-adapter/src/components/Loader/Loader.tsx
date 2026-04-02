import React from "react";

export type LoaderProps = React.HTMLAttributes<HTMLDivElement>;

export const Loader: React.FC<LoaderProps> = (props) => {
  return <div {...props}>Loader</div>;
};

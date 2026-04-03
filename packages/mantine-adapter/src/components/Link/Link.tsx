import React from "react";

export type LinkProps = React.HTMLAttributes<HTMLDivElement>;

export const Link: React.FC<LinkProps> = (props) => {
  return <div {...props}>Link</div>;
};

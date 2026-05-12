import React from "react";

export type TitleProps = React.HTMLAttributes<HTMLDivElement>;

export const Title: React.FC<TitleProps> = (props) => {
  return <div {...props}>Title</div>;
};

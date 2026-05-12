import React from "react";

export type CardProps = React.HTMLAttributes<HTMLDivElement>;

export const Card: React.FC<CardProps> = (props) => {
  return <div {...props}>Card</div>;
};

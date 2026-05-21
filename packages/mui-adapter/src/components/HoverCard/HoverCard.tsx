import React from "react";
import "./HoverCard.module.css";

export type HoverCardProps = React.HTMLAttributes<HTMLDivElement>;

export const HoverCard: React.FC<HoverCardProps> = (props) => {
  return <div {...props}>HoverCard</div>;
};

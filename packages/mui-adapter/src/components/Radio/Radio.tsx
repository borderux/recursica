import React from "react";
import "./Radio.module.css";

export type RadioProps = React.HTMLAttributes<HTMLDivElement>;

export const Radio: React.FC<RadioProps> = (props) => {
  return <div {...props}>Radio</div>;
};

import React from "react";
import "./TextArea.module.css";

export type TextAreaProps = React.HTMLAttributes<HTMLDivElement>;

export const TextArea: React.FC<TextAreaProps> = (props) => {
  return <div {...props}>TextArea</div>;
};

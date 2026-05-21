import React from "react";
import "./AssistiveElement.module.css";

export type AssistiveElementProps = React.HTMLAttributes<HTMLDivElement>;

export const AssistiveElement: React.FC<AssistiveElementProps> = (props) => {
  return <div {...props}>AssistiveElement</div>;
};

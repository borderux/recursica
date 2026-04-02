import React from "react";

export type TextAreaProps = React.HTMLAttributes<HTMLDivElement>;

export const TextArea: React.FC<TextAreaProps> = (props) => {
  return <div {...props}>TextArea</div>;
};

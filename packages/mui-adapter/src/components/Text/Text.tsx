import React from "react";

export type TextProps = React.HTMLAttributes<HTMLDivElement>;

export const Text: React.FC<TextProps> = (props) => {
  return <div {...props}>Text</div>;
};

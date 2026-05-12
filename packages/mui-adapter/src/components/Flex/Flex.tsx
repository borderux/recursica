import React from "react";

export type FlexProps = React.HTMLAttributes<HTMLDivElement>;

export const Flex: React.FC<FlexProps> = (props) => {
  return <div {...props}>Flex</div>;
};

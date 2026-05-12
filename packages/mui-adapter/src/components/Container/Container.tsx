import React from "react";

export type ContainerProps = React.HTMLAttributes<HTMLDivElement>;

export const Container: React.FC<ContainerProps> = (props) => {
  return <div {...props}>Container</div>;
};

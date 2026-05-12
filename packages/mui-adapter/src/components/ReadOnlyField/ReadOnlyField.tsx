import React from "react";

export type ReadOnlyFieldProps = React.HTMLAttributes<HTMLDivElement>;

export const ReadOnlyField: React.FC<ReadOnlyFieldProps> = (props) => {
  return <div {...props}>ReadOnlyField</div>;
};

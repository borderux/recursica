import React from "react";
import "./ReadOnlyField.module.css";

export type ReadOnlyFieldProps = React.HTMLAttributes<HTMLDivElement>;

export const ReadOnlyField: React.FC<ReadOnlyFieldProps> = (props) => {
  return <div {...props}>ReadOnlyField</div>;
};

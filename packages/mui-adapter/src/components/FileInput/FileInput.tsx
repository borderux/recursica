import React from "react";

export type FileInputProps = React.HTMLAttributes<HTMLDivElement>;

export const FileInput: React.FC<FileInputProps> = (props) => {
  return <div {...props}>FileInput</div>;
};

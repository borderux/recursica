import React from "react";

export type FileUploadProps = React.HTMLAttributes<HTMLDivElement>;

export const FileUpload: React.FC<FileUploadProps> = (props) => {
  return <div {...props}>FileUpload</div>;
};

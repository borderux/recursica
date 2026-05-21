import React from "react";
import "./FileUpload.module.css";

export type FileUploadProps = React.HTMLAttributes<HTMLDivElement>;

export const FileUpload: React.FC<FileUploadProps> = (props) => {
  return <div {...props}>FileUpload</div>;
};

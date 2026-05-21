import React from "react";
import "./Toast.module.css";

export type ToastProps = React.HTMLAttributes<HTMLDivElement>;

export const Toast: React.FC<ToastProps> = (props) => {
  return <div {...props}>Toast</div>;
};

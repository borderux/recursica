import React from "react";
import "./Modal.module.css";

export type ModalProps = React.HTMLAttributes<HTMLDivElement>;

export const Modal: React.FC<ModalProps> = (props) => {
  return <div {...props}>Modal</div>;
};

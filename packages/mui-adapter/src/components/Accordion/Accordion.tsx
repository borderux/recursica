import React from "react";
import "./Accordion.module.css";

export type AccordionProps = React.HTMLAttributes<HTMLDivElement>;

export const Accordion: React.FC<AccordionProps> = (props) => {
  return <div {...props}>Accordion</div>;
};

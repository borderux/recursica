import React from "react";
import "./Stepper.module.css";

export type StepperProps = React.HTMLAttributes<HTMLDivElement>;

export const Stepper: React.FC<StepperProps> = (props) => {
  return <div {...props}>Stepper</div>;
};

import React from "react";

export type StepperProps = React.HTMLAttributes<HTMLDivElement>;

export const Stepper: React.FC<StepperProps> = (props) => {
  return <div {...props}>Stepper</div>;
};

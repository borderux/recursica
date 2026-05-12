import React from "react";

export type SliderProps = React.HTMLAttributes<HTMLDivElement>;

export const Slider: React.FC<SliderProps> = (props) => {
  return <div {...props}>Slider</div>;
};

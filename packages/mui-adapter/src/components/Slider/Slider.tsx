import React from "react";
import "./Slider.module.css";

export type SliderProps = React.HTMLAttributes<HTMLDivElement>;

export const Slider: React.FC<SliderProps> = (props) => {
  return <div {...props}>Slider</div>;
};

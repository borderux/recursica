import { style, keyframes } from "@vanilla-extract/css";

const spin = keyframes({
  from: {
    transform: "rotate(0deg)",
  },
  to: {
    transform: "rotate(360deg)",
  },
});

export const spinning = style({
  animation: `${spin} 2s linear infinite`,
});

export const spinningFast = style({
  animation: `${spin} 0.5s linear infinite`,
});

export const spinningSlow = style({
  animation: `${spin} 3s linear infinite`,
});

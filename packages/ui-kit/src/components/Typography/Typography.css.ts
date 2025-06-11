import { style } from "@vanilla-extract/css";
import { typographies } from "./const";

const root = style({
  color: "var(--typography-color, currentColor)",
  selectors: {
    '&[data-variant="h1"]': typographies.h1,
    '&[data-variant="h2"]': typographies.h2,
    '&[data-variant="h3"]': typographies.h3,
    '&[data-variant="body-2/strong"]': typographies["body-2/strong"],
    '&[data-variant="caption"]': typographies.caption,
    '&[data-variant="overline"]': typographies.overline,
    '&[data-variant="button"]': typographies.button,
    '&[data-text-decoration="strikethrough"]': {
      textDecoration: "line-through",
    },
  },
});

export const styles = {
  root,
};

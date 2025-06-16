import { style } from "@vanilla-extract/css";
import { typographies } from "./const";

const root = style({
  color: "var(--typography-color, currentColor)",
  selectors: {
    '&[data-variant="h1"]': typographies.h1,
    '&[data-variant="h2"]': typographies.h2,
    '&[data-variant="h3"]': typographies.h3,
    '&[data-variant="h4"]': typographies.h4,
    '&[data-variant="h5"]': typographies.h5,
    '&[data-variant="h6"]': typographies.h6,
    '&[data-variant="body-1/normal"]': typographies["body-1/normal"],
    '&[data-variant="body-1/strong"]': typographies["body-1/strong"],
    '&[data-variant="body-2/normal"]': typographies["body-2/normal"],
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

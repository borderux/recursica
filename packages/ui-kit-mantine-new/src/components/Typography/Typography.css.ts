import { style } from "@vanilla-extract/css";

export const root = style({
  color: "var(--typography-color, currentColor)",

  selectors: {
    '&[data-variant="h1"]': {
      fontFamily: "var(--fonts-h1-font-family)",
      fontSize: "var(--fonts-h1-size)",
      fontWeight: 700,
      lineHeight: "initial",
      letterSpacing: 0,
    },

    '&[data-variant="h2"]': {
      fontFamily: "var(--fonts-h2-font-family)",
      fontSize: "var(--fonts-h2-size)",
      fontWeight: 600,
      lineHeight: "initial",
      letterSpacing: 0,
    },

    '&[data-variant="h3"]': {
      fontFamily: "var(--fonts-h3-font-family)",
      fontSize: "var(--fonts-h3-size)",
      fontWeight: 400,
      lineHeight: "initial",
      letterSpacing: 0,
    },

    '&[data-variant="h4"]': {
      fontFamily: "var(--fonts-h4-font-family)",
      fontSize: "var(--fonts-h4-size)",
      fontWeight: 300,
      lineHeight: "initial",
      letterSpacing: 0,
    },

    '&[data-variant="h5"]': {
      fontFamily: "var(--fonts-h5-font-family)",
      fontSize: "var(--fonts-h5-size)",
      fontWeight: 500,
      lineHeight: "initial",
      letterSpacing: 0,
    },

    '&[data-variant="h6"]': {
      fontFamily: "var(--fonts-h6-font-family)",
      fontSize: "var(--fonts-h6-size)",
      fontWeight: 400,
      lineHeight: "initial",
      letterSpacing: 0,
    },

    '&[data-variant="subtitle-1/normal"]': {
      fontFamily: "var(--fonts-subtitle-1-font-family)",
      fontSize: "var(--fonts-subtitle-1-size)",
      fontWeight: 300,
      lineHeight: 1.3,
      letterSpacing: 0,
    },

    '&[data-variant="subtitle-1/strong"]': {
      fontFamily: "var(--fonts-subtitle-1-font-family)",
      fontSize: "var(--fonts-subtitle-1-size)",
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: 0,
    },

    '&[data-variant="subtitle-2/normal"]': {
      fontFamily: "var(--fonts-subtitle-2-font-family)",
      fontSize: "var(--fonts-subtitle-2-size)",
      fontWeight: 400,
      lineHeight: 1.3,
      letterSpacing: 0,
    },

    '&[data-variant="subtitle-2/strong"]': {
      fontFamily: "var(--fonts-subtitle-2-font-family)",
      fontSize: "var(--fonts-subtitle-2-size)",
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: 0,
    },

    '&[data-variant="body-1/normal"]': {
      fontFamily: "var(--fonts-body-1-font-family)",
      fontSize: "var(--fonts-body-1-size)",
      fontWeight: 400,
      lineHeight: "initial",
      letterSpacing: 0,
    },

    '&[data-variant="body-1/strong"]': {
      fontFamily: "var(--fonts-body-1-font-family)",
      fontSize: "var(--fonts-body-1-size)",
      fontWeight: 600,
      lineHeight: "initial",
      letterSpacing: 0,
    },

    '&[data-variant="body-2/normal"]': {
      fontFamily: "var(--fonts-body-2-font-family)",
      fontSize: "var(--fonts-body-2-size)",
      fontWeight: 400,
      lineHeight: "initial",
      letterSpacing: 0.25,
    },

    '&[data-variant="body-2/strong"]': {
      fontFamily: "var(--fonts-body-2-font-family)",
      fontSize: "var(--fonts-body-2-size)",
      fontWeight: 600,
      lineHeight: "initial",
      letterSpacing: 0.25,
    },

    '&[data-variant="button"]': {
      fontFamily: "var(--fonts-button-font-family)",
      fontSize: "var(--fonts-button-size)",
      fontWeight: 400,
      lineHeight: "initial",
      letterSpacing: 0.25,
    },

    '&[data-variant="caption"]': {
      fontFamily: "var(--fonts-caption-font-family)",
      fontSize: "var(--fonts-caption-size)",
      fontWeight: 400,
      lineHeight: "initial",
      letterSpacing: 0.25,
    },

    '&[data-variant="overline"]': {
      fontFamily: "var(--fonts-overline-font-family)",
      fontSize: "var(--fonts-overline-size)",
      fontWeight: 500,
      lineHeight: "initial",
      letterSpacing: 0.3,
    },

    '&[data-text-decoration="strikethrough"]': {
      textDecoration: "line-through",
    },
  },
});

import type { CSSProperties } from "@vanilla-extract/css";
import { recursica } from "../../recursica/Recursica";
export const TypographyVariants = [
  "h1",
  "h2",
  "h3",
  "body-1/normal",
  "body-1/strong",
  "body-2/normal",
  "body-2/strong",
  "caption",
  "overline",
  "button",
] as const;

export type TypographyVariant = (typeof TypographyVariants)[number];

export const typographies: Record<TypographyVariant, CSSProperties> = {
  h1: {
    fontFamily: recursica["typography/h1"],
    fontSize: recursica["typography/h1-size"],
    fontWeight: recursica["typography/h1-weight"],
    lineHeight: recursica["typography/h1-line-height"],
    letterSpacing: recursica["typography/h1-letter-spacing"],
  },
  h2: {
    fontFamily: recursica["typography/h2"],
    fontSize: recursica["typography/h2-size"],
    fontWeight: recursica["typography/h2-weight"],
    lineHeight: recursica["typography/h2-line-height"],
    letterSpacing: recursica["typography/h2-letter-spacing"],
  },
  h3: {
    fontFamily: recursica["typography/h3"],
    fontSize: recursica["typography/h3-size"],
    fontWeight: recursica["typography/h3-weight"],
    lineHeight: recursica["typography/h3-line-height"],
    letterSpacing: recursica["typography/h3-letter-spacing"],
  },
  "body-1/normal": {
    fontFamily: recursica["typography/body-1/normal"],
    fontSize: recursica["typography/body-1/normal-size"],
    fontWeight: recursica["typography/body-1/normal-weight"],
    lineHeight: recursica["typography/body-1/normal-line-height"],
    letterSpacing: recursica["typography/body-1/normal-letter-spacing"],
  },
  "body-1/strong": {
    fontFamily: recursica["typography/body-1/strong"],
    fontSize: recursica["typography/body-1/strong-size"],
    fontWeight: recursica["typography/body-1/strong-weight"],
    lineHeight: recursica["typography/body-1/strong-line-height"],
    letterSpacing: recursica["typography/body-1/strong-letter-spacing"],
  },
  "body-2/normal": {
    fontFamily: recursica["typography/body-2/normal"],
    fontSize: recursica["typography/body-2/normal-size"],
    fontWeight: recursica["typography/body-2/normal-weight"],
    lineHeight: recursica["typography/body-2/normal-line-height"],
    letterSpacing: recursica["typography/body-2/normal-letter-spacing"],
  },
  "body-2/strong": {
    fontFamily: recursica["typography/body-2/strong"],
    fontSize: recursica["typography/body-2/strong-size"],
    fontWeight: recursica["typography/body-2/strong-weight"],
    lineHeight: recursica["typography/body-2/strong-line-height"],
    letterSpacing: recursica["typography/body-2/strong-letter-spacing"],
  },
  caption: {
    fontFamily: recursica["typography/caption"],
    fontSize: recursica["typography/caption-size"],
    fontWeight: recursica["typography/caption-weight"],
    lineHeight: recursica["typography/caption-line-height"],
    letterSpacing: recursica["typography/caption-letter-spacing"],
  },
  overline: {
    fontFamily: recursica["typography/overline"],
    fontSize: recursica["typography/overline-size"],
    fontWeight: recursica["typography/overline-weight"],
    lineHeight: recursica["typography/overline-line-height"],
    letterSpacing: recursica["typography/overline-letter-spacing"],
  },
  button: {
    fontFamily: recursica["typography/button"],
    fontSize: recursica["typography/button-size"],
    fontWeight: recursica["typography/button-weight"],
    lineHeight: recursica["typography/button-line-height"],
    letterSpacing: recursica["typography/button-letter-spacing"],
  },
};

import { style } from "@vanilla-extract/css";
import { recursica } from "../../recursica/Recursica";
import { typographies } from "../Typography";

const root = style({
  // Root doesn't have gap
});

const separator = style({
  // Separator doesn't have padding and is the slash icon
  padding: 0,
});

const breadcrumb = style({
  ...typographies.button,
  display: "flex",
  alignItems: "center",
  padding: recursica["breadcrumb/size/padding"],
  gap: recursica["breadcrumb/size/spacing"],
  textDecoration: "none",
  selectors: {
    // Interactive (link) styling
    '&[data-interactive="true"]': {
      color: recursica["breadcrumb/color/interactive"],
    },
    // Non-interactive styling
    '&[data-interactive="false"]': {
      color: recursica["breadcrumb/color/no-interactive"],
    },
  },
});

export const styles = {
  root,
  separator,
  breadcrumb,
};

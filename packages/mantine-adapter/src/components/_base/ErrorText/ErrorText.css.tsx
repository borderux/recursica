import { style } from "@vanilla-extract/css";
import { recursica } from "@recursica/official-release/recursica";

export const root = style({
  color: recursica.uiKit["global/form/assistive-element/error/text-color"],
  fontFamily: recursica.themes["font/caption/font-family"],
  fontSize: recursica.themes["font/caption/size"],
  fontWeight: recursica.themes["font/caption/weight"],
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
});

export const icon = style({
  color: recursica.uiKit["global/form/assistive-element/error/icon-color"],
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
});

export const styles = {
  root,
  icon,
};

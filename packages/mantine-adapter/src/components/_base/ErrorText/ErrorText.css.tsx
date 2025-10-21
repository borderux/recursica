import { style } from "@vanilla-extract/css";
import { recursica } from "@recursica/official-release/recursica";

export const root = style({
  color: recursica.uiKit["global/form/assistive-element/error/text-color"],
  display: "flex",
  alignItems: "center",
});

export const icon = style({
  color: recursica.uiKit["global/form/assistive-element/error/icon-color"],
  display: "flex",
  alignItems: "center",
});

export const styles = {
  root,
  icon,
};

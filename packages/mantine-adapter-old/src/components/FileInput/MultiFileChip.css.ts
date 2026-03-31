/**
 * 1. Chip mult-select background is broken in Figma
 */
import { style } from "@vanilla-extract/css";
import { recursica } from "@recursica/official-release/recursica";

const root = style({
  display: "inline-flex",
  alignItems: "center",
  gap: recursica.uiKit["chip/size/icon-text-gap"],
  backgroundColor: recursica.uiKit["chip/color/unselected/background"],
  border: `1px solid ${recursica.uiKit["chip/color/unselected/border"]}`,
  borderRadius: recursica.uiKit["chip/size/border-radius"],
  padding: `${recursica.uiKit["chip/size/horizontal-padding"]} ${recursica.uiKit["chip/size/vertical-padding"]}`,
  maxWidth: recursica.uiKit["chip/size/max-width"],
  color: recursica.uiKit["chip/color/unselected/text"],
  fontFamily: recursica.themes["font/body-small/font-family"],
  fontSize: recursica.themes["font/body-small/size"],
  fontWeight: recursica.themes["font/body-small/weight-normal"],
  letterSpacing: recursica.themes["font/body-small/letter-spacing"],
  cursor: "pointer",
  outline: "none",
  selectors: {
    "&:focus": {
      outline: "none",
      backgroundColor: "pink", // Chip mult-select background is broken in Figma
    },
  },
});

const label = style({
  flex: 1,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

const closeButton = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: recursica.uiKit["chip/size/icon"],
  height: recursica.uiKit["chip/size/icon"],
  color: "inherit",
  padding: 0,
  flexShrink: 0,
});

const closeIcon = style({
  width: "100%",
  height: "100%",
});

export const styles = {
  root,
  label,
  closeButton,
  closeIcon,
};

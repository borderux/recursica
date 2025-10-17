import { style } from "@vanilla-extract/css";
import { recursica } from "@recursica/official-release";
import {
  root as formControlLayoutRoot,
  wrapper as formControlLayoutWrapper,
} from "../base/FormControlLayout/FormControlLayout.css";

const root = style({
  ...formControlLayoutRoot,
  minWidth: recursica.uiKit["dropdown/size/min-width"],
  maxWidth: recursica.uiKit["dropdown/size/max-width"],
});

const wrapper = style({
  ...formControlLayoutWrapper,
});

const input = style({
  height: recursica.uiKit["dropdown/size/field-height"],
  border: "none",
  minWidth: recursica.uiKit["dropdown/size/min-width"],
  maxWidth: recursica.uiKit["dropdown/size/max-width"],
  outlineWidth: 1,
  outlineStyle: "solid",
  outlineColor: recursica.uiKit["dropdown/color/border"],
  borderRadius: recursica.uiKit["dropdown/size/border-radius"],
  paddingBlock: recursica.uiKit["dropdown/size/vertical-padding"],
  paddingInline: recursica.uiKit["dropdown/size/horizontal-padding"],
  backgroundColor: recursica.uiKit["dropdown/color/background"],
  color: recursica.uiKit["dropdown/color/text-valued"],
  selectors: {
    "&::placeholder": {
      opacity: recursica.uiKit["dropdown/color/text-placeholder-opacity"],
    },
    "&:disabled::placeholder": {
      opacity: recursica.uiKit["dropdown/color/disabled"],
    },
    // The leading and trailing icons are 24px wide and 8px apart, we need to set padding to don't overlap with the text
    // When leading icon is present, add padding to the left
    [`${wrapper}[data-with-left-section="true"] &`]: {
      paddingLeft: `calc(${recursica.uiKit["dropdown/size/horizontal-padding"]} + 24px + 8px)`,
    },
    // When trailing icon is present, add padding to the right
    [`${wrapper}[data-with-right-section="true"] &`]: {
      paddingRight: `calc(${recursica.uiKit["dropdown/size/horizontal-padding"]} + 24px + 8px)`,
    },
    "&:focus-visible": {
      outlineWidth: 2,
      outlineStyle: "solid",
      outlineColor: recursica.uiKit["dropdown/color/border-selected"],
    },
    '&[data-error="true"]': {
      outlineColor: recursica.uiKit["dropdown/color/border-error"],
    },
  },
});

// This is the section that contains the leading and trailing icons
const section = style({
  width: "auto",
  color: "currentcolor",
  paddingBlock: recursica.uiKit["dropdown/size/vertical-padding"],
  paddingInline: recursica.uiKit["dropdown/size/horizontal-padding"],
  selectors: {
    '&[data-position="left"]': {
      paddingRight: 0,
    },
    '&[data-position="right"]': {
      paddingLeft: 0,
    },
    [`${input}[data-expanded="true"] ~ &`]: {
      rotate: "180deg",
      paddingRight: 0,
      paddingLeft: recursica.uiKit["dropdown/size/horizontal-padding"],
    },
  },
});

const dropdown = style({
  padding: 0,
  borderRadius: recursica.uiKit["menu/size/border-radius"],
  overflowY: "auto",
});

export const optionStyle = style({
  gap: recursica.uiKit["menu-item/size/spacing"],
  color: recursica.uiKit["menu-item/color/text"],
  width: "100%",
  padding: recursica.uiKit["menu-item/size/padding"],
  backgroundColor: recursica.uiKit["menu-item/color/enabled"],
  ":hover": {
    backgroundColor: recursica.uiKit["menu-item/color/focused"],
  },
  selectors: {
    '&[aria-selected="true"]': {
      backgroundColor: recursica.uiKit["menu-item/color/selected"],
    },
    '&[data-combobox-disabled="true"]': {
      backgroundColor: recursica.uiKit["menu-item/color/enabled"],
      opacity: recursica.uiKit["menu-item/color/disabled"],
    },
  },
});

const option = style({
  padding: 0,
  // Default hover behavior is to show the parent background color
  ":hover": {
    backgroundColor: "transparent",
  },
});

export const errorContainer = style({
  alignItems: "center",
  color: recursica.uiKit["global/form/assistive-element/error/text-color"],
  gap: recursica.uiKit["global/form/assistive-element/size/icon-text-gap"],
});

const label = style({
  gridArea: "label",
  color: recursica.uiKit["global/form/label/color/default"],
});

export const styles = {
  root,
  wrapper,
  input,
  section,
  dropdown,
  option,
  label,
};

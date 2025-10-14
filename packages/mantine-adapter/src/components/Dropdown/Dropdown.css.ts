import { style } from "@vanilla-extract/css";
import { recursica } from "@recursica/official-release";

const root = style({
  display: "grid",
  width: "100%",
  minWidth: recursica.uiKit["dropdown/size/min-width"],
  maxWidth: recursica.uiKit["dropdown/size/max-width"],
  gap: `${recursica.uiKit["global/form/label/size/stacked/bottom-padding"]} ${recursica.uiKit["global/form/label/size/side-by-side-large/gutter"]}`,
  selectors: {
    "&[data-label-placement='Side by Side']": {
      gridTemplateColumns: `auto 1fr`,
      gridTemplateAreas: `"label input" "label error"`,
      alignItems: "start",
    },
    "&[data-label-placement='Stacked']": {
      gridTemplateColumns: "1fr",
      gridTemplateAreas: `"label" "input" "error"`,
    },
  },
});

const wrapper = style({
  selectors: {
    [`${root}[data-label-placement='Side by Side'] &`]: {
      gridArea: "input",
    },
    [`${root}[data-label-placement='Stacked'] &`]: {
      gridArea: "input",
    },
  },
});

const input = style({
  height: recursica.uiKit["dropdown/size/field-height"],
  border: "none",
  minWidth: recursica.uiKit["dropdown/size/min-width"],
  maxWidth: recursica.uiKit["dropdown/size/max-width"],
  outline: `1px solid ${recursica.uiKit["dropdown/color/border"]}`,
  borderRadius: recursica.uiKit["dropdown/size/border-radius"],
  paddingBlock: recursica.uiKit["dropdown/size/vertical-padding"],
  paddingInline: recursica.uiKit["dropdown/size/horizontal-padding"],
  backgroundColor: recursica.uiKit["dropdown/color/background"],
  selectors: {
    "&::placeholder": {
      opacity: recursica.uiKit["dropdown/color/text-placeholder-opacity"],
    },
    "&:disabled::placeholder": {
      opacity: recursica.uiKit["dropdown/color/disabled"],
    },
    [`${wrapper}[data-with-left-section="true"] &`]: {
      paddingLeft: `calc(${recursica.uiKit["dropdown/size/horizontal-padding"]} + 24px + 8px)`,
    },
    [`${wrapper}[data-with-right-section="true"] &`]: {
      paddingRight: `calc(${recursica.uiKit["dropdown/size/horizontal-padding"]} + 24px + 8px)`,
    },
    "&:focus-visible": {
      outlineWidth: 1,
      outlineStyle: "solid",
      outlineColor: recursica.uiKit["dropdown/color/border"],
    },
    '&[data-expanded="true"]': {
      outlineWidth: 2,
      outlineStyle: "solid",
      outlineColor: recursica.uiKit["dropdown/color/border-selected"],
    },
    '&[value]:not([value=""]):not([disabled])': {
      outlineWidth: 1,
      outlineStyle: "solid",
      outlineColor: recursica.uiKit["dropdown/color/border-selected"],
    },
    '&[value]:not([value=""]):not([disabled]):focus-visible': {
      outlineWidth: 2,
      outlineStyle: "solid",
      outlineColor: recursica.uiKit["dropdown/color/border-selected"],
    },
    '&[data-error="true"]': {
      outlineWidth: 1,
      outlineStyle: "solid",
      outlineColor: recursica.uiKit["dropdown/color/border-error"],
    },
    '&[data-error="true"][value]:not([value=""]):not([disabled])': {
      outlineWidth: 1,
      outlineStyle: "solid",
      outlineColor: recursica.uiKit["dropdown/color/border-error"],
    },
    '&[data-error="true"]:focus-visible, &[data-error="true"][data-expanded="true"]':
      {
        outlineWidth: 2,
        outlineStyle: "solid",
        outlineColor: recursica.uiKit["dropdown/color/border-error"],
      },
  },
});

const section = style({
  width: "auto",
  color: "currentcolor",
  paddingBlock: recursica.uiKit["dropdown/size/vertical-padding"],
  paddingInline: recursica.uiKit["dropdown/size/horizontal-padding"],
  selectors: {
    '&[data-position="side-by-side"]': {
      paddingRight: 0,
    },
    '&[data-position="stacked"]': {
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
  maxHeight: 250,
  overflowY: "auto",
});

export const optionStyle = style({
  gap: recursica.uiKit["menu-item/size/spacing"],
  color: recursica.uiKit["menu-item/color/text"],
  borderRadius: 0,
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
  ":hover": {
    backgroundColor: "transparent",
  },
});

export const errorContainer = style({
  alignItems: "center",
  color: recursica.uiKit["global/form/assistive-element/error/text-color"],
  gap: recursica.uiKit["global/form/assistive-element/size/icon-text-gap"],
});

const checkbox = style({
  backgroundColor: recursica.uiKit["dropdown/color/background"],
  color: recursica.uiKit["checkbox/color/icon"],
  width: 20,
  height: 20,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const label = style({
  gridArea: "label",
});

export const styles = {
  root,
  wrapper,
  input,
  section,
  dropdown,
  checkbox,
  option,
  label,
};

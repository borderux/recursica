import { style } from "@vanilla-extract/css";
import { typographies } from "../Typography";
import { recursica } from "../../recursica/Recursica";

const label = style({
  ...typographies["body-2/normal"],
});

const root = style({
  display: "flex",
  flexDirection: "column",
  minWidth: recursica["text-field/size/min-width"],
  maxWidth: recursica["text-field/size/max-width"],
  gap: recursica["text-field/size/spacing-inline"],
});

const wrapper = style({
  margin: 0,
});

const placeholder = style({
  ...typographies["body-2/normal"],
  color: recursica["form/value+placeholder/color/input-value"],
});

const input = style({
  ...typographies["body-2/normal"],
  overflow: "hidden",
  textOverflow: "ellipsis",
  minHeight: recursica["text-field/size/min-input-height"],
  height: "auto",
  border: "none",
  minWidth: recursica["text-field/size/min-width"],
  maxWidth: recursica["text-field/size/max-width"],
  outline: `1px solid ${recursica["text-field/color/border"]}`,
  borderRadius: recursica["date-picker/size/border-radius"],
  paddingBlock: recursica["text-field/size/vertical-padding"],
  paddingInline: recursica["text-field/size/horizontal-padding"],
  backgroundColor: recursica["text-field/color/background-input"],
  selectors: {
    "&:disabled": {
      color: recursica["form/value+placeholder/color/input-value"],
      backgroundColor: recursica["text-field/color/background-input"],
    },
    "&[readonly]": {
      backgroundColor: recursica["text-field/color/read-only-background"],
      color: recursica["form/value+placeholder/color/input-value"],
    },
    [`${wrapper}[data-with-left-section="true"] &`]: {
      paddingLeft: `calc(${recursica["text-field/size/horizontal-padding"]} + 24px + 8px)`,
    },
    [`${wrapper}[data-with-right-section="true"] &`]: {
      paddingRight: `calc(${recursica["text-field/size/horizontal-padding"]} + 24px + 8px)`,
    },
    '&:focus-within,&[aria-expanded="true"]': {
      outline: `2px solid ${recursica["text-field/color/border-focus"]}`,
    },
    [`&:not(:has(${placeholder}))`]: {
      outline: `1px solid ${recursica["text-field/color/border"]}`,
    },
  },
});

const section = style({
  width: "auto",
  alignItems: "baseline",
  color: recursica["form/icon/color/icon-color"],
  paddingBlock: recursica["text-field/size/vertical-padding"],
  paddingInline: recursica["text-field/size/horizontal-padding"],
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
      paddingLeft: recursica["text-field/size/horizontal-padding"],
    },
    [`${wrapper}[data-disabled="true"]  &`]: {
      color: recursica["form/label/color/disabled"],
    },
  },
});

const calendarHeader = style({
  padding: recursica["date-picker/size/padding"],
  margin: 0,
  maxWidth: "unset",
});

const calendarHeaderLevel = style({
  ...typographies.button,
  order: 0,
  justifyContent: "flex-start",
  selectors: {
    "&:hover": {
      backgroundColor: "unset !important",
    },
  },
});

const calendarHeaderControl = style({
  selectors: {
    "&:hover": {
      backgroundColor: "unset !important",
    },
    '&[data-direction="previous"]': {
      order: 1,
    },
    '&[data-direction="next"]': {
      order: 2,
    },
  },
});

const dropdown = style({
  padding: 0,
  border: `1px solid ${recursica["date-picker/color/border"]}`,
  backgroundColor: recursica["date-picker/color/background"],
  borderRadius: recursica["date-picker/size/border-radius"],
});

const weekday = style({
  ...typographies["body-2/normal"],
  color: recursica["date-picker/color/date-regular"],
  padding: recursica["date-picker/size/date-padding"],
  width: recursica["date-picker/size/date-size"],
  height: recursica["date-picker/size/date-size"],
  boxSizing: "content-box",
});

const monthCell = style({
  padding: recursica["date-picker/size/date-padding"],
});

const day = style({
  ...typographies["body-2/normal"],
  color: recursica["date-picker/color/date-regular"],
  width: recursica["date-picker/size/date-size"],
  height: recursica["date-picker/size/date-size"],
  borderRadius: 0,
  selectors: {
    "&:hover": {
      backgroundColor: `${recursica["date-picker/color/date-hover"]} !important`,
    },
    '&[data-today="true"]': {
      outline: `1px solid ${recursica["date-picker/color/date-regular"]}`,
      borderRadius: recursica["date-picker/size/date-border-radius"],
    },
    '&[data-selected="true"]': {
      color: recursica["date-picker/color/date-selected"],
      backgroundColor: recursica["date-picker/color/background-date-selected"],
      borderRadius: recursica["date-picker/size/date-border-radius"],
    },
  },
});

const listCell = style({
  padding: recursica["date-picker/size/date-padding"],
});

const listControl = style({
  width: recursica["date-picker/size/month-year-width"],
  height: recursica["date-picker/size/month-year-height"],
  borderRadius: 0,
  selectors: {
    "&:hover": {
      backgroundColor: recursica["date-picker/color/date-hover"],
    },
    '&[data-selected="true"]': {
      backgroundColor: recursica["date-picker/color/background-date-selected"],
    },
  },
});

export const styles = {
  label,
  root,
  wrapper,
  input,
  section,
  placeholder,
  calendarHeader,
  calendarHeaderLevel,
  calendarHeaderControl,
  dropdown,
  weekday,
  monthCell,
  day,
  monthsListCell: listCell,
  monthsListControl: listControl,
  yearsListCell: listCell,
  yearsListControl: listControl,
};

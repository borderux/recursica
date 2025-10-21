/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Styling comments
 *
 * 1. What is the style for hover?
 * 2. There is no variable for file-input/color/disabled.  Its just file-input/color/border.  Even if it doesn't change, it should be a variable in case someone wants to style it
 * 3. Same goes for disabled background color.  Its just file-input/color/background.  Even if it doesn't change, it should be a variable in case someone wants to style it
 * 4. Same with error state background
 * 5. Focus appears to be making a thicker border of stroke weight 2, but that is hard-coded in Figma with no variable
 */

import { style } from "@vanilla-extract/css";
import { recursica } from "@recursica/official-release/recursica";

/*
  | "file-upload/drop-zone/color/background"
  | "file-input/color/background"
  | "file-input/color/background-read-only"
  | "file-input/color/border"
  | "file-input/color/border-focus"
  | "file-input/color/border-selected"
  | "file-input/color/border-error"
  | "file-input/color/upload-icon"
  | "file-input/color/clear-icon"
  | "file-input/color/text-valued"
  | "file-input/color/placeholder-text-opacity"
  | "file-input/color/disabled"
  | "file-input/size/border-radius"
  | "file-input/size/icon-text-gap"
  | "file-input/size/field-height"
  | "file-input/size/horizontal-padding"
  | "file-input/size/icon"
  | "file-input/size/max-width"
  | "file-input/size/min-width"
  | "file-input/size/vertical-padding"
*/

export const wrapper = style({
  backgroundColor: recursica.uiKit["file-input/color/background"],
  borderColor: recursica.uiKit["file-input/color/border"],
  borderRadius: recursica.uiKit["file-input/size/border-radius"],
  minWidth: recursica.uiKit["file-input/size/min-width"],
  maxWidth: recursica.uiKit["file-input/size/max-width"],
  color: recursica.uiKit["file-input/color/text-valued"],
  margin: 0,
  borderWidth: 1,
  borderStyle: "solid",
  boxSizing: "border-box",
});

export const input = style({
  fontFamily: recursica.themes["font/body/font-family"],
  fontWeight: recursica.themes["font/body-small/weight-normal"],
  fontSize: recursica.themes["font/body-small/size"],
  color: recursica.uiKit["file-input/color/text-valued"],
  selectors: {
    "&::placeholder": {
      color: recursica.uiKit["file-input/color/text-valued"],
      opacity: recursica.uiKit["file-input/color/placeholder-text-opacity"],
    },
  },
});

// State-specific styles
export const stateEnabled = style({
  // Default enabled state - inherits from base wrapper
});

export const stateDisabled = style({
  backgroundColor: recursica.uiKit["file-input/color/background"],
  borderColor: recursica.uiKit["file-input/color/disabled"],
  borderWidth: 1,
  borderStyle: "solid",
});

export const stateError = style({
  backgroundColor: recursica.uiKit["file-input/color/background"],
  borderColor: recursica.uiKit["file-input/color/border-error"],
});

export const stateErrorFocused = style({
  backgroundColor: recursica.uiKit["file-input/color/background"],
  borderColor: recursica.uiKit["file-input/color/border-error"],
});

export const stateFocused = style({
  backgroundColor: recursica.uiKit["file-input/color/background"],
  borderColor: recursica.uiKit["file-input/color/border-focus"],
});

// Focus styles using focus ring (box-shadow)
export const wrapperWithFocus = style({
  selectors: {
    "&:focus-within": {
      boxShadow: `0 0 0 1px ${recursica.uiKit["file-input/color/border-focus"]}`,
    },
  },
});

export const wrapperWithErrorFocus = style({
  selectors: {
    "&:focus-within": {
      boxShadow: `0 0 0 1px ${recursica.uiKit["file-input/color/border-error"]}`,
    },
  },
});

import { recursica } from "@recursica/official-release";
import type { ComplexStyleRule } from "@vanilla-extract/css";

export const root: ComplexStyleRule = {
  display: "grid",
  width: "100%",
  gap: `${recursica.uiKit["global/form/label/size/stacked/bottom-padding"]} ${recursica.uiKit["global/form/label/size/side-by-side-large/gutter"]}`,
  selectors: {
    "&[data-form-control-layout='Side by Side']": {
      gridTemplateColumns: `auto 1fr`,
      gridTemplateAreas: `"label input" "label error"`,
      alignItems: "start",
    },
    "&[data-form-control-layout='Stacked']": {
      gridTemplateColumns: "1fr",
      gridTemplateAreas: `"label" "input" "error"`,
    },
  },
};

export const wrapper: ComplexStyleRule = {
  gridArea: "input",
};

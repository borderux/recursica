// Help file for storybook utilities to be used in your storybook stories that use the label component
// DO NOT: put this in the index.ts or import into code or you will contaminate the index.ts file with the storybook utilities

export const LABEL_STORYBOOK_ARG_TYPES = {
  Show_label: {
    control: "boolean",
    description: "Boolean to show/hide the label",
  },
  Label_placement: {
    control: "select",
    options: ["top", "left"],
    description:
      "The placement of the label relative to the form input component",
  },
  Label: {
    control: "text",
    description: "Label text. You can also use the children prop",
  },
  Indicator: {
    control: "select",
    options: [
      "none",
      "asterisk / truncate overflow",
      "asterisk / full label text",
      "optional",
    ],
    description: "Defines the required indicator and behavior",
  },
};

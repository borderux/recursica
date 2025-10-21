import{L as t}from"./Label-CapSqBGF.js";import"./iframe-B9Jd1eqC.js";import"./preload-helper-PPVm8Dsz.js";import"./Input-Cx8ZZ3YI.js";import"./UnstyledButton-DyEOAy_y.js";const i={title:"Components/_Base/Label",component:t,argTypes:{Show_label:{control:"boolean",description:"Boolean to show/hide the label"},Indicator:{control:"select",options:["none","asterisk / truncate overflow","asterisk / full label text","optional"],description:"Defines the required indicator and behavior"},Label:{control:"text",description:"Label text. You can also use the children prop"},children:{control:"table",table:{disable:!0}},Optional_text:{control:"text",description:"Optional text to display after the label. Default is (optional)"},Label_placement:{control:"select",options:["top","left"],description:"The placement of the label relative to the form input component"},required:{control:"boolean",description:"If true, forces Indicator to be asterisk type with truncate overflow as default.  This an HTML/mantine prop, not a Figma prop"},useLabelComponent:{control:"table",table:{disable:!0}}}},e={args:{Label:"Default Label",Show_label:!0,Indicator:"none",Optional_text:"(optional)",required:!1,useLabelComponent:!0}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    Label: "Default Label",
    Show_label: true,
    Indicator: "none",
    Optional_text: "(optional)",
    required: false,
    useLabelComponent: true
  } as any
}`,...e.parameters?.docs?.source}}};const s=["Default"];export{e as Default,s as __namedExportsOrder,i as default};

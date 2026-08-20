import{j as e}from"./iframe-yFO9_h67.js";import{D as T}from"./DatePicker-Ds5lxq-j.js";import{f as j}from"./commonArgTypes-DcjzA9l3.js";import"./preload-helper-Dp1pzeXC.js";import"./useMobilePicker-BrHnRdRZ.js";import"./formatErrorMessage-DkKmrRLY.js";import"./useTimeout-DCc5tZ70.js";import"./useThemeProps-Cr20WL95.js";import"./useThemeProps-DOXGOqGC.js";import"./Typography-BBqC3LoX.js";import"./memoTheme-Cs-mGQPZ.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./Modal-CfiYkl_f.js";import"./ownerWindow-HkKU3E4x.js";import"./ownerDocument-DW-IO8s5.js";import"./useForkRef-BP39VcSK.js";import"./useEventCallback-Dhf6GR_Y.js";import"./createChainedFunction-BO_9K8Jh.js";import"./mergeSlotProps-BE-kXrtt.js";import"./isHostComponent-DVu5iVWx.js";import"./useSlot-GWIS9v9k.js";import"./Portal-BzK9Nkqp.js";import"./index-DMUXnocV.js";import"./index-Cn2MFYP5.js";import"./getActiveElement-BwNsGdKK.js";import"./contains-B5PScIlI.js";import"./useTheme-ClQ29JAn.js";import"./utils-GSRiR4op.js";import"./Grow-bNdXYCbQ.js";import"./Paper-CP2DSCEc.js";import"./Popper-BW8skROQ.js";import"./useSlotProps-CA0x3ErO.js";import"./useFormControl-VBpSDqz8.js";import"./FormControlWrapper-BA3ROMmo.js";import"./AssistiveElement-hSlLnwms.js";import"./isMuiElement-JD1EuSGT.js";import"./IconButton-DwV6N5QM.js";import"./ButtonBase-BmmDnOUH.js";import"./isFocusVisible-B8k4qzLc.js";import"./CircularProgress-VtX-y_xH.js";import"./createSvgIcon-Do3FOz5r.js";import"./DialogContent-C9vJX2eI.js";import"./Button-B0ThBdFh.js";import"./List-DB3z2eJR.js";import"./Chip-DDGpiKnO.js";import"./WithReadOnlyWrapper-t7b-1QVb.js";import"./ReadOnlyField-CAvWsNZ2.js";const Ee={title:"UI-Kit/DatePicker",component:T,tags:["autodocs"],parameters:{docs:{description:{component:`
The \`DatePicker\` primitive provides a unified calendar date selection input integrated directly into the \`FormControlWrapper\` architecture.

### Architectural Decoupling
Recursica overrides MUI X's \`DatePicker\` field/popover defaults, safely injecting the date picker into our rigid structural layout systems. State modifiers (e.g. Focus, Errors, ReadOnly) hook seamlessly back onto our native CSS mapping architecture.

### Examples
Always structure horizontal architectures via the generic \`formLayout\` parameter.
\`\`\`tsx
<DatePicker 
  label="Start Date" 
  assistiveText="Select the deployment kick-off date." 
  formLayout="stacked" 
/>
\`\`\`
`}}},argTypes:{...j,disabled:{control:"boolean",description:"Maps the formal disabled variable states structurally to the input core."},error:{control:"text",description:"Applies the strict error string boundary rendering invalid structures seamlessly."},required:{control:"boolean"},label:{control:"text"},assistiveText:{control:"text"},readOnly:{control:"boolean",description:"Toggles structural read-only data presentation explicitly blocking standard component bindings."}}},r={args:{disabled:!1,label:"Project Deadline",assistiveText:"Specify the absolute cutoff for code submission."}},t={args:{label:"Incident Start Date",assistiveText:"When did the incident originally occur?",formLayout:"side-by-side"}};function P({className:L}){return e.jsxs("svg",{className:L,width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"3",y:"4",width:"18",height:"18",rx:"2",ry:"2"}),e.jsx("line",{x1:"16",y1:"2",x2:"16",y2:"6"}),e.jsx("line",{x1:"8",y1:"2",x2:"8",y2:"6"}),e.jsx("line",{x1:"3",y1:"10",x2:"21",y2:"10"})]})}const a={args:{label:"Launch Date",slots:{openPickerIcon:P}}},o={args:{label:"Disabled Date Range",disabled:!0}},i={args:{label:"Execution Date",error:"The chosen date conflicts with an existing deployment freeze.",required:!0}},s={args:{label:"Static ReadOnly Review",value:new Date("2026-05-21"),readOnly:!0}},n={args:{label:"Editable ReadOnly Review",defaultValue:new Date("2026-06-01"),readOnly:!0,labelWithEditIcon:!0}};var c,l,d;r.parameters={...r.parameters,docs:{...(c=r.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    disabled: false,
    label: "Project Deadline",
    assistiveText: "Specify the absolute cutoff for code submission."
  }
}`,...(d=(l=r.parameters)==null?void 0:l.docs)==null?void 0:d.source}}};var p,m,u;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    label: "Incident Start Date",
    assistiveText: "When did the incident originally occur?",
    formLayout: "side-by-side"
  }
}`,...(u=(m=t.parameters)==null?void 0:m.docs)==null?void 0:u.source}}};var g,y,b;a.parameters={...a.parameters,docs:{...(g=a.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    label: "Launch Date",
    slots: {
      openPickerIcon: CustomLeadingIcon
    }
  }
}`,...(b=(y=a.parameters)==null?void 0:y.docs)==null?void 0:b.source}}};var h,f,x;o.parameters={...o.parameters,docs:{...(h=o.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    label: "Disabled Date Range",
    disabled: true
  }
}`,...(x=(f=o.parameters)==null?void 0:f.docs)==null?void 0:x.source}}};var D,S,v;i.parameters={...i.parameters,docs:{...(D=i.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    label: "Execution Date",
    error: "The chosen date conflicts with an existing deployment freeze.",
    required: true
  }
}`,...(v=(S=i.parameters)==null?void 0:S.docs)==null?void 0:v.source}}};var k,R,O;s.parameters={...s.parameters,docs:{...(k=s.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    label: "Static ReadOnly Review",
    value: new Date("2026-05-21"),
    readOnly: true
  }
}`,...(O=(R=s.parameters)==null?void 0:R.docs)==null?void 0:O.source}}};var w,E,I;n.parameters={...n.parameters,docs:{...(w=n.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    label: "Editable ReadOnly Review",
    defaultValue: new Date("2026-06-01"),
    readOnly: true,
    labelWithEditIcon: true
  }
}`,...(I=(E=n.parameters)==null?void 0:E.docs)==null?void 0:I.source}}};const Ie=["Default","FormsSideBySide","WithLeadingIcon","Disabled","ErrorState","StaticReadOnly","EditableReadOnly"];export{r as Default,o as Disabled,n as EditableReadOnly,i as ErrorState,t as FormsSideBySide,s as StaticReadOnly,a as WithLeadingIcon,Ie as __namedExportsOrder,Ee as default};

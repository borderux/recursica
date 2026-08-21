import{j as e}from"./iframe-10v8QMyl.js";import{D as T}from"./DatePicker-J6OzuC4Z.js";import{f as j}from"./commonArgTypes-DcjzA9l3.js";import"./preload-helper-Dp1pzeXC.js";import"./useMobilePicker-DRpaV9Nm.js";import"./formatErrorMessage-DkKmrRLY.js";import"./useTimeout-CTQ8vi8_.js";import"./useThemeProps-C2G5_9Ay.js";import"./useThemeProps-y8YbBDzJ.js";import"./Typography-BfREonS5.js";import"./memoTheme-CCnXGp5I.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./Modal-BYglP_vd.js";import"./ownerWindow-HkKU3E4x.js";import"./ownerDocument-DW-IO8s5.js";import"./useForkRef-os7NZpNf.js";import"./useEventCallback-BJRC8zW0.js";import"./createChainedFunction-BO_9K8Jh.js";import"./mergeSlotProps-Dyg-NJL-.js";import"./isHostComponent-DVu5iVWx.js";import"./useSlot-5wNbeD3S.js";import"./Portal-DFRXWij2.js";import"./index-B-nWQHBQ.js";import"./index-Cdi2EwxE.js";import"./getActiveElement-BwNsGdKK.js";import"./contains-B5PScIlI.js";import"./useTheme-BWphYy9m.js";import"./utils-BhtdqA9Z.js";import"./Grow-BxCMvq1w.js";import"./Paper-BSxCTLlB.js";import"./Popper-DYKuD-hq.js";import"./useSlotProps-5t6HbnbA.js";import"./useFormControl-BE6jq9lL.js";import"./FormControlWrapper-DNuR56Xi.js";import"./AssistiveElement-KqfwARnn.js";import"./isMuiElement-CLcIVvwJ.js";import"./IconButton-CelMWSn8.js";import"./ButtonBase-Al4BvGGP.js";import"./isFocusVisible-B8k4qzLc.js";import"./CircularProgress-BSIe_D4X.js";import"./createSvgIcon-Dtd7JC7n.js";import"./DialogContent-wzZVbLD0.js";import"./Button-CRrQXlt1.js";import"./List-BDZDQB7Z.js";import"./Chip-PyoB-AGY.js";import"./WithReadOnlyWrapper-Do66p6ta.js";import"./ReadOnlyField-0Q_W8DNR.js";const Ee={title:"UI-Kit/DatePicker",component:T,tags:["autodocs"],parameters:{docs:{description:{component:`
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

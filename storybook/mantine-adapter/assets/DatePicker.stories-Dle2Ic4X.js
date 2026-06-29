import{j as e}from"./iframe-DyBNPiC1.js";import{D as I}from"./DatePicker-DIQ3LQLp.js";import{f as L}from"./commonArgTypes-DcjzA9l3.js";import"./preload-helper-Dp1pzeXC.js";import"./WithReadOnlyWrapper-BEFaaN92.js";import"./ReadOnlyField-Ce_Eike0.js";import"./get-size-D2StqF49.js";import"./factory-BCJdCO96.js";import"./polymorphic-factory-CUMspToA.js";import"./create-optional-context-4aTJBr7t.js";import"./use-resolved-styles-api-D-Jb7eJi.js";import"./CloseButton-CuQ2F95T.js";import"./UnstyledButton-pll0nim4.js";import"./use-id-Dew4zDnN.js";import"./AssistiveElement-D58-8os0.js";import"./use-uncontrolled-DQCKd1AO.js";import"./use-disclosure-DAcz3iwL.js";import"./AccordionChevron-BZHYfLO1.js";import"./clamp-DTmYCdls.js";import"./use-input-props-Dhy0gN2Z.js";import"./Modal-33GddWGf.js";import"./OptionalPortal-CIFUx1vd.js";import"./is-element-D4yZFtA1.js";import"./index-BELW-cBP.js";import"./index-Bx-BqvTW.js";import"./use-merged-ref-kGVoq8tG.js";import"./NativeScrollArea-Gpjnphvn.js";import"./use-reduced-motion-DY5D8Qke.js";import"./FocusTrap-DKYi3vcB.js";import"./Paper-CBp_Q1Ql.js";import"./Transition-DEROL4O9.js";import"./create-safe-context-nLLW0AdN.js";import"./ScrollArea-DPdK7gRW.js";import"./floating-ui.react-OwZucOI6.js";import"./DirectionProvider-9xpdFhM7.js";import"./to-int-PQE0s6ay.js";import"./Popover-DAuxBkBO.js";import"./get-floating-position-C4x8qAuU.js";const ye={title:"UI-Kit/DatePicker",component:I,tags:["autodocs"],parameters:{docs:{description:{component:`
The \`DatePicker\` primitive provides a unified calendar date selection input integrated directly into the \`FormControlWrapper\` architecture.

### Architectural Decoupling
Recursica overrides the internal Mantine \`DatePickerInput\` wrapper defaults, safely injecting the date picker into our rigid structural layout systems. State modifiers (e.g. Focus, Errors, ReadOnly) hook seamlessly back onto our native CSS mapping architecture.

### Examples
Always structure horizontal architectures via the generic \`formLayout\` parameter.
\`\`\`tsx
<DatePicker 
  label="Start Date" 
  assistiveText="Select the deployment kick-off date." 
  formLayout="stacked" 
/>
\`\`\`
`}}},argTypes:{...L,disabled:{control:"boolean",description:"Maps the formal disabled variable states structurally to the input core."},error:{control:"text",description:"Applies the strict error string boundary rendering invalid structures seamlessly."},required:{control:"boolean"},label:{control:"text"},assistiveText:{control:"text"},readOnly:{control:"boolean",description:"Toggles structural read-only data presentation explicitly blocking standard component bindings."}}},r={args:{disabled:!1,label:"Project Deadline",placeholder:"Select a deadline...",assistiveText:"Specify the absolute cutoff for code submission."}},t={args:{label:"Incident Start Date",placeholder:"Pick date...",assistiveText:"When did the incident originally occur?",formLayout:"side-by-side"}},a={args:{label:"Launch Date",placeholder:"Select launch date...",leftSection:e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"3",y:"4",width:"18",height:"18",rx:"2",ry:"2"}),e.jsx("line",{x1:"16",y1:"2",x2:"16",y2:"6"}),e.jsx("line",{x1:"8",y1:"2",x2:"8",y2:"6"}),e.jsx("line",{x1:"3",y1:"10",x2:"21",y2:"10"})]})}},o={args:{label:"Disabled Date Range",placeholder:"Disabled selection...",disabled:!0}},i={args:{label:"Execution Date",placeholder:"Pick a valid date...",error:"The chosen date conflicts with an existing deployment freeze.",required:!0}},n={args:{label:"Static ReadOnly Review",placeholder:"Ignored...",value:new Date("2026-05-21"),readOnly:!0}},s={args:{label:"Editable ReadOnly Review",placeholder:"Ignored until active...",defaultValue:new Date("2026-06-01"),readOnly:!0,labelWithEditIcon:!0}};var l,c,d;r.parameters={...r.parameters,docs:{...(l=r.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    disabled: false,
    label: "Project Deadline",
    placeholder: "Select a deadline...",
    assistiveText: "Specify the absolute cutoff for code submission."
  }
}`,...(d=(c=r.parameters)==null?void 0:c.docs)==null?void 0:d.source}}};var p,m,u;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    label: "Incident Start Date",
    placeholder: "Pick date...",
    assistiveText: "When did the incident originally occur?",
    formLayout: "side-by-side"
  }
}`,...(u=(m=t.parameters)==null?void 0:m.docs)==null?void 0:u.source}}};var h,y,g;a.parameters={...a.parameters,docs:{...(h=a.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    label: "Launch Date",
    placeholder: "Select launch date...",
    leftSection: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
  }
}`,...(g=(y=a.parameters)==null?void 0:y.docs)==null?void 0:g.source}}};var b,x,f;o.parameters={...o.parameters,docs:{...(b=o.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    label: "Disabled Date Range",
    placeholder: "Disabled selection...",
    disabled: true
  }
}`,...(f=(x=o.parameters)==null?void 0:x.docs)==null?void 0:f.source}}};var S,D,v;i.parameters={...i.parameters,docs:{...(S=i.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    label: "Execution Date",
    placeholder: "Pick a valid date...",
    error: "The chosen date conflicts with an existing deployment freeze.",
    required: true
  }
}`,...(v=(D=i.parameters)==null?void 0:D.docs)==null?void 0:v.source}}};var k,w,R;n.parameters={...n.parameters,docs:{...(k=n.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    label: "Static ReadOnly Review",
    placeholder: "Ignored...",
    value: new Date("2026-05-21"),
    readOnly: true
  }
}`,...(R=(w=n.parameters)==null?void 0:w.docs)==null?void 0:R.source}}};var O,E,j;s.parameters={...s.parameters,docs:{...(O=s.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    label: "Editable ReadOnly Review",
    placeholder: "Ignored until active...",
    defaultValue: new Date("2026-06-01"),
    readOnly: true,
    labelWithEditIcon: true
  }
}`,...(j=(E=s.parameters)==null?void 0:E.docs)==null?void 0:j.source}}};const ge=["Default","FormsSideBySide","WithLeadingIcon","Disabled","ErrorState","StaticReadOnly","EditableReadOnly"];export{r as Default,o as Disabled,s as EditableReadOnly,i as ErrorState,t as FormsSideBySide,n as StaticReadOnly,a as WithLeadingIcon,ge as __namedExportsOrder,ye as default};

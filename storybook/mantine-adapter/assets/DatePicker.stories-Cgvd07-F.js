import{j as e}from"./iframe-oYtE5cjn.js";import{D as I}from"./DatePicker-C1oc0Osa.js";import{f as L}from"./commonArgTypes-DcjzA9l3.js";import"./preload-helper-Dp1pzeXC.js";import"./WithReadOnlyWrapper-ehowdbDA.js";import"./ReadOnlyField-KdWilfXH.js";import"./get-size-DSTSojjy.js";import"./factory-cPRSk-ET.js";import"./polymorphic-factory-dVyCEWHC.js";import"./create-optional-context-e10W-B_s.js";import"./use-resolved-styles-api-KWpaybiB.js";import"./CloseButton-Tu_9aGqV.js";import"./UnstyledButton-tscyQpQ2.js";import"./use-id-HhrMXFTp.js";import"./AssistiveElement-BCVSpv8J.js";import"./use-uncontrolled-NAz-YDPE.js";import"./use-disclosure-J8mC1Sos.js";import"./AccordionChevron-CuXYycuG.js";import"./clamp-DTmYCdls.js";import"./use-input-props-CwS7rqok.js";import"./Modal-DSD8C4I4.js";import"./OptionalPortal-6Vjdh-l_.js";import"./is-element-Ohp0Jv7o.js";import"./index-CEpvbvaq.js";import"./index-XShu5g5I.js";import"./use-merged-ref-CdnDhhBL.js";import"./NativeScrollArea-Br-TzSFW.js";import"./use-reduced-motion-BK-CWA4g.js";import"./FocusTrap-CQA6MHx5.js";import"./Paper-BSk8hO4y.js";import"./Transition-DPdppHpJ.js";import"./create-safe-context-l9Fk2IeW.js";import"./ScrollArea-CuP-Pa_Y.js";import"./floating-ui.react-D-d2fUBI.js";import"./DirectionProvider-BVKFKSib.js";import"./to-int-PQE0s6ay.js";import"./Popover-9_Z43IhZ.js";import"./get-floating-position-CdjJP_hv.js";const ye={title:"UI-Kit/DatePicker",component:I,tags:["autodocs"],parameters:{docs:{description:{component:`
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

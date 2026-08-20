import{j as e}from"./iframe-BaN8EIKL.js";import{D as L}from"./DatePicker-Dw9O2mkz.js";import{f as T}from"./commonArgTypes-DcjzA9l3.js";import"./preload-helper-Dp1pzeXC.js";import"./WithReadOnlyWrapper-Bm-C86cC.js";import"./FormControlWrapper-Ci45PAcz.js";import"./get-size-DxiyYKv9.js";import"./factory-B0Jv6HX0.js";import"./polymorphic-factory-DzFPP9uC.js";import"./create-optional-context-CRUA43xc.js";import"./use-resolved-styles-api-CHET4gcA.js";import"./CloseButton-DKhDP38-.js";import"./UnstyledButton-BrzEulqP.js";import"./use-id-DVb8foRL.js";import"./AssistiveElement-Bw7lb-7S.js";import"./ReadOnlyField-CAlD42ci.js";import"./use-uncontrolled-DbQmygD9.js";import"./use-disclosure-DYkug8H4.js";import"./AccordionChevron-CSLaGxJh.js";import"./clamp-DTmYCdls.js";import"./use-input-props-_2VIn5gV.js";import"./Modal-CsKQzNCy.js";import"./OptionalPortal-BmW_48sq.js";import"./is-element-BiFRcqCx.js";import"./index-chvSQIDk.js";import"./index-DxQDuIb5.js";import"./use-merged-ref-DEKPTmDI.js";import"./NativeScrollArea-BhEt44mh.js";import"./use-reduced-motion-CpX2H5OV.js";import"./FocusTrap-cRCkQhkX.js";import"./Paper-B87mAZxr.js";import"./Transition-CnxG6H6G.js";import"./create-safe-context-IlRRlhSl.js";import"./ScrollArea-7Pj1CYAg.js";import"./floating-ui.react-C5I3ZAS4.js";import"./DirectionProvider-wxjJICZQ.js";import"./to-int-PQE0s6ay.js";import"./Popover-C2tR0lMW.js";import"./get-floating-position-YzUmJ21B.js";import"./use-click-outside-lD3VXuLS.js";const be={title:"UI-Kit/DatePicker",component:L,tags:["autodocs"],parameters:{docs:{description:{component:`
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
`}}},argTypes:{...T,disabled:{control:"boolean",description:"Maps the formal disabled variable states structurally to the input core."},error:{control:"text",description:"Applies the strict error string boundary rendering invalid structures seamlessly."},required:{control:"boolean"},label:{control:"text"},assistiveText:{control:"text"},readOnly:{control:"boolean",description:"Toggles structural read-only data presentation explicitly blocking standard component bindings."}}},r={args:{disabled:!1,label:"Project Deadline",assistiveText:"Specify the absolute cutoff for code submission."}},t={args:{label:"Incident Start Date",assistiveText:"When did the incident originally occur?",formLayout:"side-by-side"}},a={args:{label:"Launch Date",leftSection:e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"3",y:"4",width:"18",height:"18",rx:"2",ry:"2"}),e.jsx("line",{x1:"16",y1:"2",x2:"16",y2:"6"}),e.jsx("line",{x1:"8",y1:"2",x2:"8",y2:"6"}),e.jsx("line",{x1:"3",y1:"10",x2:"21",y2:"10"})]})}},o={args:{label:"Disabled Date Range",disabled:!0}},i={args:{label:"Execution Date",error:"The chosen date conflicts with an existing deployment freeze.",required:!0}},s={args:{label:"Static ReadOnly Review",value:new Date("2026-05-21"),readOnly:!0}},n={args:{label:"Editable ReadOnly Review",defaultValue:new Date("2026-06-01"),readOnly:!0,labelWithEditIcon:!0}};var l,c,d;r.parameters={...r.parameters,docs:{...(l=r.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    disabled: false,
    label: "Project Deadline",
    assistiveText: "Specify the absolute cutoff for code submission."
  }
}`,...(d=(c=r.parameters)==null?void 0:c.docs)==null?void 0:d.source}}};var p,m,u;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    label: "Incident Start Date",
    assistiveText: "When did the incident originally occur?",
    formLayout: "side-by-side"
  }
}`,...(u=(m=t.parameters)==null?void 0:m.docs)==null?void 0:u.source}}};var y,g,h;a.parameters={...a.parameters,docs:{...(y=a.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    label: "Launch Date",
    leftSection: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
  }
}`,...(h=(g=a.parameters)==null?void 0:g.docs)==null?void 0:h.source}}};var b,x,f;o.parameters={...o.parameters,docs:{...(b=o.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    label: "Disabled Date Range",
    disabled: true
  }
}`,...(f=(x=o.parameters)==null?void 0:x.docs)==null?void 0:f.source}}};var D,S,v;i.parameters={...i.parameters,docs:{...(D=i.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    label: "Execution Date",
    error: "The chosen date conflicts with an existing deployment freeze.",
    required: true
  }
}`,...(v=(S=i.parameters)==null?void 0:S.docs)==null?void 0:v.source}}};var k,w,R;s.parameters={...s.parameters,docs:{...(k=s.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    label: "Static ReadOnly Review",
    value: new Date("2026-05-21"),
    readOnly: true
  }
}`,...(R=(w=s.parameters)==null?void 0:w.docs)==null?void 0:R.source}}};var O,E,j;n.parameters={...n.parameters,docs:{...(O=n.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    label: "Editable ReadOnly Review",
    defaultValue: new Date("2026-06-01"),
    readOnly: true,
    labelWithEditIcon: true
  }
}`,...(j=(E=n.parameters)==null?void 0:E.docs)==null?void 0:j.source}}};const xe=["Default","FormsSideBySide","WithLeadingIcon","Disabled","ErrorState","StaticReadOnly","EditableReadOnly"];export{r as Default,o as Disabled,n as EditableReadOnly,i as ErrorState,t as FormsSideBySide,s as StaticReadOnly,a as WithLeadingIcon,xe as __namedExportsOrder,be as default};

import{j as r}from"./iframe-C_ymJL69.js";import{T as t}from"./TextField-CXUicuv-.js";import{f as A}from"./commonArgTypes-DcjzA9l3.js";import"./preload-helper-Dp1pzeXC.js";import"./WithReadOnlyWrapper-CTB5FDTb.js";import"./ReadOnlyField-CmK4Xprm.js";import"./AssistiveElement-BX1CLCG3.js";import"./useFormControl-CCBjUjcD.js";import"./memoTheme-DuK-uO2q.js";import"./styled-CVDphjR5.js";import"./generateUtilityClass-BtcU_pBl.js";import"./generateUtilityClasses-DDbjFgb8.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./FormControlLayout-CxLXgHi1.js";import"./isMuiElement-DGxPhrgs.js";import"./InputBase-eM2MzAVe.js";import"./useForkRef-BlrSiLQa.js";import"./ownerDocument-DW-IO8s5.js";import"./getActiveElement-BwNsGdKK.js";import"./ownerWindow-HkKU3E4x.js";import"./useEventCallback-guZE-voT.js";import"./debounce-Be36O1Ab.js";import"./isHostComponent-DVu5iVWx.js";const ie={title:"UI-Kit/TextField",component:t,tags:["autodocs"],parameters:{docs:{description:{component:`
The \`TextField\` primitive functions as a universal text entry input natively integrated directly into the unified \`FormControlWrapper\` architecture.

### Architectural Decoupling
Recursica forcibly overrides the internal MUI \`InputBase\` defaults injecting an untamed input layout primitive perfectly mapped back into our rigid design systems. State modifiers (e.g. Focus, Errors) hook flawlessly back onto our CSS module mapping variable colors strictly accurately.

### Examples
Always structure horizontal architectures via the generic \`formLayout\` parameter.
\`\`\`tsx
<TextField 
  label="Primary Network Socket" 
  assistiveText="Ensure connections resolve seamlessly." 
  formLayout="stacked" 
/>
\`\`\`
`}},controls:{include:["disabled","error","required","label","assistiveText","readOnly","formLayout","labelSize","labelAlignment","labelOptionalText","labelWithEditIcon"]}},argTypes:{...A,disabled:{control:"boolean",description:"Maps the formal disabled variable states structurally to the input core."},error:{control:"text",description:"Applies the strict error string boundary rendering invalid structures seamlessly."},required:{control:"boolean"},label:{control:"text"},assistiveText:{control:"text"},readOnly:{control:"boolean",description:"Toggles structural read-only data presentation explicitly blocking standard component bindings."}}},a={args:{disabled:!1,label:"Authentication Token",placeholder:"Enter validation hash...",assistiveText:"Tokens are stored identically locally and strictly ephemeral."},render:({...e})=>r.jsx(t,{...e})},n={args:{label:"Distributed Access Control",placeholder:"admin@node.local",assistiveText:"Specify the exact cluster administrative credentials enforcing strict domain policies. This violently long string tests native textual wrapping safely mapping alongside inputs.",formLayout:"side-by-side"},render:({...e})=>r.jsx(t,{...e})},i={args:{label:"Search Global Context",placeholder:"Search for repositories...",leftSection:r.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[r.jsx("circle",{cx:"11",cy:"11",r:"8"}),r.jsx("line",{x1:"21",y1:"21",x2:"16.65",y2:"16.65"})]})},render:({...e})=>r.jsx(t,{...e})},o={args:{label:"Validation URL",placeholder:"https://recursica.dev",rightSection:r.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:r.jsx("polyline",{points:"20 6 9 17 4 12"})})},render:({...e})=>r.jsx(t,{...e})},s={args:{label:"Disabled Deployment Node",placeholder:"Disabled primitive map...",disabled:!0},render:({...e})=>r.jsx(t,{...e})},l={args:{label:"Cluster Failure",placeholder:"Failing component instance...",defaultValue:"Invalid Execution Plan",error:"Critical runtime node disconnect detected traversing DOM architecture.",required:!0},render:({...e})=>r.jsx(t,{...e})},d={args:{label:"Static ReadOnly Review",placeholder:"Ignored...",value:"Explicitly Uneditable Bound Output",readOnly:!0},render:({...e})=>r.jsx(t,{...e})},c={args:{label:"Editable ReadOnly Review",placeholder:"Ignored until active...",defaultValue:"Waiting for Edit Execution",readOnly:!0,labelWithEditIcon:!0},render:({...e})=>r.jsx(t,{...e})};var p,u,m;a.parameters={...a.parameters,docs:{...(p=a.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    disabled: false,
    label: "Authentication Token",
    placeholder: "Enter validation hash...",
    assistiveText: "Tokens are stored identically locally and strictly ephemeral."
  },
  render: ({
    ...args
  }: any) => <TextField {...args} />
}`,...(m=(u=a.parameters)==null?void 0:u.docs)==null?void 0:m.source}}};var g,y,h;n.parameters={...n.parameters,docs:{...(g=n.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    label: "Distributed Access Control",
    placeholder: "admin@node.local",
    assistiveText: "Specify the exact cluster administrative credentials enforcing strict domain policies. This violently long string tests native textual wrapping safely mapping alongside inputs.",
    formLayout: "side-by-side"
  },
  render: ({
    ...args
  }: any) => <TextField {...args} />
}`,...(h=(y=n.parameters)==null?void 0:y.docs)==null?void 0:h.source}}};var x,b,v;i.parameters={...i.parameters,docs:{...(x=i.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    label: "Search Global Context",
    placeholder: "Search for repositories...",
    leftSection: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
  },
  render: ({
    ...args
  }: any) => <TextField {...args} />
}`,...(v=(b=i.parameters)==null?void 0:b.docs)==null?void 0:v.source}}};var f,S,T;o.parameters={...o.parameters,docs:{...(f=o.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    label: "Validation URL",
    placeholder: "https://recursica.dev",
    rightSection: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
  },
  render: ({
    ...args
  }: any) => <TextField {...args} />
}`,...(T=(S=o.parameters)==null?void 0:S.docs)==null?void 0:T.source}}};var k,E,j;s.parameters={...s.parameters,docs:{...(k=s.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    label: "Disabled Deployment Node",
    placeholder: "Disabled primitive map...",
    disabled: true
  },
  render: ({
    ...args
  }: any) => <TextField {...args} />
}`,...(j=(E=s.parameters)==null?void 0:E.docs)==null?void 0:j.source}}};var F,O,w;l.parameters={...l.parameters,docs:{...(F=l.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    label: "Cluster Failure",
    placeholder: "Failing component instance...",
    defaultValue: "Invalid Execution Plan",
    error: "Critical runtime node disconnect detected traversing DOM architecture.",
    required: true
  },
  render: ({
    ...args
  }: any) => <TextField {...args} />
}`,...(w=(O=l.parameters)==null?void 0:O.docs)==null?void 0:w.source}}};var L,I,R;d.parameters={...d.parameters,docs:{...(L=d.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    label: "Static ReadOnly Review",
    placeholder: "Ignored...",
    value: "Explicitly Uneditable Bound Output",
    readOnly: true
  },
  render: ({
    ...args
  }: any) => <TextField {...args} />
}`,...(R=(I=d.parameters)==null?void 0:I.docs)==null?void 0:R.source}}};var C,D,W;c.parameters={...c.parameters,docs:{...(C=c.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    label: "Editable ReadOnly Review",
    placeholder: "Ignored until active...",
    defaultValue: "Waiting for Edit Execution",
    readOnly: true,
    labelWithEditIcon: true
  },
  render: ({
    ...args
  }: any) => <TextField {...args} />
}`,...(W=(D=c.parameters)==null?void 0:D.docs)==null?void 0:W.source}}};const oe=["Default","FormsSideBySide","WithLeadingIcon","WithTrailingIcon","Disabled","ErrorState","StaticReadOnly","EditableReadOnly"];export{a as Default,s as Disabled,c as EditableReadOnly,l as ErrorState,n as FormsSideBySide,d as StaticReadOnly,i as WithLeadingIcon,o as WithTrailingIcon,oe as __namedExportsOrder,ie as default};

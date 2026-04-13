import{j as s}from"./iframe-Cfrmv-sD.js";import{F as k}from"./FormControlWrapper-XFze9NYg.js";import{T as F}from"./TextField-CRre9Lno.js";import{f as W}from"./commonArgTypes-DcjzA9l3.js";import"./preload-helper-Dp1pzeXC.js";import"./get-size-0ZAaIumh.js";import"./factory-B3pmeTAA.js";import"./polymorphic-factory-F4O7v52k.js";import"./create-optional-context-DKB1ywIg.js";import"./UnstyledButton-dfWf7gTY.js";import"./use-id-DgIgn6iy.js";import"./AssistiveElement-X6WZVyQ_.js";import"./ReadOnlyField-CHxkEH0K.js";const P={title:"UI-Kit/FormControlWrapper",component:k,tags:["autodocs"],parameters:{docs:{description:{component:"The `FormControlWrapper` is the ultimate structural replacement for Mantine's built-in `Input.Wrapper`. By abandoning Mantine's opinionated wrappers entirely, we centralize all label tracking, error rendering, ARIA generation, and grid layouts natively inside this single component.\n\n### Usage with Naked Primitives\nThis component wraps 'naked' elements like `<Input>` directly. The demonstration stories below utilize `<TextField>` as a native display vehicle, since `<TextField>` natively pipes all its properties structurally back into this wrapper."}}},argTypes:{...W,error:{control:"text",description:"Error string driving native assistive component and validation markers."},assistiveText:{control:"text",description:"Helper instructions safely dynamically anchored below the input box."},assistiveWithIcon:{control:"boolean"},required:{control:"boolean"}}},n=o=>s.jsx(F,{placeholder:"Form Control primitive mapped...",...o}),e={args:{label:"Account Username",formLayout:"stacked",assistiveText:"Validation occurs immediately natively."},render:n},r={args:{label:"Encryption Protocol",formLayout:"stacked",error:"Strict validation limits reached. Handshake rejected securely."},render:n},t={args:{label:"Root Password",formLayout:"side-by-side",required:!0,assistiveText:"Bypass string structure required to initiate protocol."},render:n},a={args:{label:"Server Domain",assistiveText:"A standard text boundary without default native icon parameters bounding.",assistiveWithIcon:!1},render:n},i={description:"Bypassing the TextField map to show exactly how native `<input>` hooks execute inside the raw wrapper natively perfectly.",args:{label:"Raw HTML Checkbox",formLayout:"side-by-side",assistiveText:"This wraps a raw HTML input tag mapping correctly."},render:o=>s.jsx("div",{style:{display:"flex",gap:"10px",alignItems:"center"},children:s.jsx(k,{...o,children:s.jsx("input",{type:"checkbox",style:{margin:0,width:"16px",height:"16px"}})})})};var l,c,d;e.parameters={...e.parameters,docs:{...(l=e.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    label: "Account Username",
    formLayout: "stacked",
    assistiveText: "Validation occurs immediately natively."
  },
  render: renderWithTextField
}`,...(d=(c=e.parameters)==null?void 0:c.docs)==null?void 0:d.source}}};var p,m,u;r.parameters={...r.parameters,docs:{...(p=r.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    label: "Encryption Protocol",
    formLayout: "stacked",
    error: "Strict validation limits reached. Handshake rejected securely."
  },
  render: renderWithTextField
}`,...(u=(m=r.parameters)==null?void 0:m.docs)==null?void 0:u.source}}};var y,h,x;t.parameters={...t.parameters,docs:{...(y=t.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    label: "Root Password",
    formLayout: "side-by-side",
    required: true,
    assistiveText: "Bypass string structure required to initiate protocol."
  },
  render: renderWithTextField
}`,...(x=(h=t.parameters)==null?void 0:h.docs)==null?void 0:x.source}}};var g,v,T;a.parameters={...a.parameters,docs:{...(g=a.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    label: "Server Domain",
    assistiveText: "A standard text boundary without default native icon parameters bounding.",
    assistiveWithIcon: false
  },
  render: renderWithTextField
}`,...(T=(v=a.parameters)==null?void 0:v.docs)==null?void 0:T.source}}};var b,w,f;i.parameters={...i.parameters,docs:{...(b=i.parameters)==null?void 0:b.docs,source:{originalSource:`{
  description: "Bypassing the TextField map to show exactly how native \`<input>\` hooks execute inside the raw wrapper natively perfectly.",
  args: {
    label: "Raw HTML Checkbox",
    formLayout: "side-by-side",
    assistiveText: "This wraps a raw HTML input tag mapping correctly."
  },
  render: args => <div style={{
    display: "flex",
    gap: "10px",
    alignItems: "center"
  }}>
      {/* We can cleanly wrap even un-styled HTML primitives! */}
      <FormControlWrapper {...args}>
        <input type="checkbox" style={{
        margin: 0,
        width: "16px",
        height: "16px"
      }} />
      </FormControlWrapper>
    </div>
}`,...(f=(w=i.parameters)==null?void 0:w.docs)==null?void 0:f.source}}};const U=["Default","VisualErrorState","RequiredArchitecture","WithoutAssistiveIcons","NativeChildrenDirectly"];export{e as Default,i as NativeChildrenDirectly,t as RequiredArchitecture,r as VisualErrorState,a as WithoutAssistiveIcons,U as __namedExportsOrder,P as default};

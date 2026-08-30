import{j as s}from"./iframe-DR-INLC0.js";import{a as k}from"./FormControlWrapper-Ihrqi2ZL.js";import{T as F}from"./TextField-8YjZfp51.js";import{f as L}from"./commonArgTypes-DcjzA9l3.js";import"./preload-helper-Dp1pzeXC.js";import"./Label-VNEleq_e.js";import"./get-size-D0EXS9U1.js";import"./factory-DITFcJHQ.js";import"./polymorphic-factory-C7BhgFU3.js";import"./create-optional-context-CYjrubmi.js";import"./use-resolved-styles-api-BQwmyGG0.js";import"./CloseButton-OgdhdTEi.js";import"./UnstyledButton-efBzRtQX.js";import"./use-id-7hhaRI77.js";import"./AssistiveElement-BllSNf-H.js";import"./WithReadOnlyWrapper-3lMlh9PQ.js";import"./ReadOnlyField-CUffDlui.js";const K={title:"UI-Kit/FormControlWrapper",component:k,tags:["autodocs"],parameters:{docs:{description:{component:"The `FormControlWrapper` is the ultimate structural replacement for Mantine's built-in `Input.Wrapper`. By abandoning Mantine's opinionated wrappers entirely, we centralize all label tracking, error rendering, ARIA generation, and grid layouts natively inside this single component.\n\n### Usage with Naked Primitives\nThis component wraps 'naked' elements like `<Input>` directly. The demonstration stories below utilize `<TextField>` as a native display vehicle, since `<TextField>` natively pipes all its properties structurally back into this wrapper."}}},argTypes:{...L,error:{control:"text",description:"Error string driving native assistive component and validation markers."},assistiveText:{control:"text",description:"Helper instructions safely dynamically anchored below the input box."},assistiveWithIcon:{control:"boolean"},required:{control:"boolean"}}},n=o=>s.jsx(F,{placeholder:"Form Control primitive mapped...",...o}),e={args:{label:"Account Username",formLayout:"stacked",assistiveText:"Validation occurs immediately natively."},render:n},r={args:{label:"Encryption Protocol",formLayout:"stacked",error:"Strict validation limits reached. Handshake rejected securely."},render:n},t={args:{label:"Root Password",formLayout:"side-by-side",required:!0,assistiveText:"Bypass string structure required to initiate protocol."},render:n},i={args:{label:"Server Domain",assistiveText:"A standard text boundary without default native icon parameters bounding.",assistiveWithIcon:!1},render:n},a={parameters:{docs:{description:{story:"Bypassing the TextField map to show exactly how native `<input>` hooks execute inside the raw wrapper natively perfectly."}}},args:{label:"Raw HTML Checkbox",formLayout:"side-by-side",assistiveText:"This wraps a raw HTML input tag mapping correctly."},render:({withLayer:o,layer:A,...W})=>s.jsx("div",{style:{display:"flex",gap:"10px",alignItems:"center"},children:s.jsx(k,{...W,children:s.jsx("input",{type:"checkbox",style:{margin:0,width:"16px",height:"16px"}})})})};var l,p,c;e.parameters={...e.parameters,docs:{...(l=e.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    label: "Account Username",
    formLayout: "stacked",
    assistiveText: "Validation occurs immediately natively."
  },
  render: renderWithTextField
}`,...(c=(p=e.parameters)==null?void 0:p.docs)==null?void 0:c.source}}};var d,m,u;r.parameters={...r.parameters,docs:{...(d=r.parameters)==null?void 0:d.docs,source:{originalSource:`{
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
}`,...(x=(h=t.parameters)==null?void 0:h.docs)==null?void 0:x.source}}};var g,v,b;i.parameters={...i.parameters,docs:{...(g=i.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    label: "Server Domain",
    assistiveText: "A standard text boundary without default native icon parameters bounding.",
    assistiveWithIcon: false
  },
  render: renderWithTextField
}`,...(b=(v=i.parameters)==null?void 0:v.docs)==null?void 0:b.source}}};var T,w,f;a.parameters={...a.parameters,docs:{...(T=a.parameters)==null?void 0:T.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: "Bypassing the TextField map to show exactly how native \`<input>\` hooks execute inside the raw wrapper natively perfectly."
      }
    }
  },
  args: {
    label: "Raw HTML Checkbox",
    formLayout: "side-by-side",
    assistiveText: "This wraps a raw HTML input tag mapping correctly."
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => <div style={{
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
}`,...(f=(w=a.parameters)==null?void 0:w.docs)==null?void 0:f.source}}};const O=["Default","VisualErrorState","RequiredArchitecture","WithoutAssistiveIcons","NativeChildrenDirectly"];export{e as Default,a as NativeChildrenDirectly,t as RequiredArchitecture,r as VisualErrorState,i as WithoutAssistiveIcons,O as __namedExportsOrder,K as default};

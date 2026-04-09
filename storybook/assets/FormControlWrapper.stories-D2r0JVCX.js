import{j as e}from"./iframe-CphPjEVK.js";import{F}from"./FormControlWrapper-Dkkvy1Hl.js";import{T as W}from"./adapter-common-BLbBFVzm.js";import{T as C}from"./TextField-zK4i_wUL.js";import"./preload-helper-Dp1pzeXC.js";import"./filterStylingProps-Cd5Jg4Cp.js";import"./get-size-Cyen0TVy.js";import"./factory-B-0KiR2C.js";import"./polymorphic-factory-BY4dselc.js";import"./UnstyledButton-C6M6-eqI.js";import"./use-id-DeuPlgQc.js";import"./AssistiveElement-C4XrV8E3.js";import"./ReadOnlyField-CUdHhLT6.js";const V={title:"UI-Kit/FormControlWrapper",component:F,tags:["autodocs"],parameters:{docs:{description:{component:"The `FormControlWrapper` is the ultimate structural replacement for Mantine's built-in `Input.Wrapper`. By abandoning Mantine's opinionated wrappers entirely, we centralize all label tracking, error rendering, ARIA generation, and grid layouts natively inside this single component.\n\n### Usage with Naked Primitives\nThis component wraps 'naked' elements like `<Input>` directly. The demonstration stories below utilize `<TextField>` as a native display vehicle, since `<TextField>` natively pipes all its properties structurally back into this wrapper."}}},argTypes:{formLayout:{control:"radio",options:["stacked","side-by-side"],description:"Controls the architectural grid mapping labels linearly or side-by-side."},error:{control:"text",description:"Error string driving native assistive component and validation markers."},assistiveText:{control:"text",description:"Helper instructions safely dynamically anchored below the input box."},assistiveWithIcon:{control:"boolean"},required:{control:"boolean"},layer:{control:"radio",options:[0,1,2,3],description:"The design system layer context",table:{category:"Story Controls"}}}},n=({layer:o=0,label:l,...L})=>e.jsx(W,{layer:o,style:{padding:"24px"},children:e.jsx(C,{label:l,placeholder:"Form Control primitive mapped...",...L})}),r={args:{label:"Account Username",formLayout:"stacked",assistiveText:"Validation occurs immediately natively.",layer:0},render:n},t={args:{label:"Encryption Protocol",formLayout:"stacked",error:"Strict validation limits reached. Handshake rejected securely."},render:n},a={args:{label:"Root Password",formLayout:"side-by-side",required:!0,assistiveText:"Bypass string structure required to initiate protocol."},render:n},i={args:{label:"Server Domain",assistiveText:"A standard text boundary without default native icon parameters bounding.",assistiveWithIcon:!1},render:n},s={description:"Bypassing the TextField map to show exactly how native `<input>` hooks execute inside the raw wrapper natively perfectly.",args:{label:"Raw HTML Checkbox",formLayout:"side-by-side",assistiveText:"This wraps a raw HTML input tag mapping correctly."},render:({layer:o=0,...l})=>e.jsx(W,{layer:o,style:{padding:"24px",display:"flex",gap:"10px",alignItems:"center"},children:e.jsx(F,{...l,children:e.jsx("input",{type:"checkbox",style:{margin:0,width:"16px",height:"16px"}})})})};var c,d,p;r.parameters={...r.parameters,docs:{...(c=r.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    label: "Account Username",
    formLayout: "stacked",
    assistiveText: "Validation occurs immediately natively.",
    layer: 0
  },
  render: renderWithTextField
}`,...(p=(d=r.parameters)==null?void 0:d.docs)==null?void 0:p.source}}};var m,u,y;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    label: "Encryption Protocol",
    formLayout: "stacked",
    error: "Strict validation limits reached. Handshake rejected securely."
  },
  render: renderWithTextField
}`,...(y=(u=t.parameters)==null?void 0:u.docs)==null?void 0:y.source}}};var h,g,x;a.parameters={...a.parameters,docs:{...(h=a.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    label: "Root Password",
    formLayout: "side-by-side",
    required: true,
    assistiveText: "Bypass string structure required to initiate protocol."
  },
  render: renderWithTextField
}`,...(x=(g=a.parameters)==null?void 0:g.docs)==null?void 0:x.source}}};var v,b,T;i.parameters={...i.parameters,docs:{...(v=i.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    label: "Server Domain",
    assistiveText: "A standard text boundary without default native icon parameters bounding.",
    assistiveWithIcon: false
  },
  render: renderWithTextField
}`,...(T=(b=i.parameters)==null?void 0:b.docs)==null?void 0:T.source}}};var w,f,k;s.parameters={...s.parameters,docs:{...(w=s.parameters)==null?void 0:w.docs,source:{originalSource:`{
  description: "Bypassing the TextField map to show exactly how native \`<input>\` hooks execute inside the raw wrapper natively perfectly.",
  args: {
    label: "Raw HTML Checkbox",
    formLayout: "side-by-side",
    assistiveText: "This wraps a raw HTML input tag mapping correctly."
  },
  render: ({
    layer = 0,
    ...args
  }) => <Layer layer={layer as 0 | 1 | 2 | 3} style={{
    padding: "24px",
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
    </Layer>
}`,...(k=(f=s.parameters)==null?void 0:f.docs)==null?void 0:k.source}}};const N=["Default","VisualErrorState","RequiredArchitecture","WithoutAssistiveIcons","NativeChildrenDirectly"];export{r as Default,s as NativeChildrenDirectly,a as RequiredArchitecture,t as VisualErrorState,i as WithoutAssistiveIcons,N as __namedExportsOrder,V as default};

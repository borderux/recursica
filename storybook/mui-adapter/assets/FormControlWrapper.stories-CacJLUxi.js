import{j as o}from"./iframe-C_ymJL69.js";import{F}from"./ReadOnlyField-CmK4Xprm.js";import{T as k}from"./TextField-CXUicuv-.js";import{f as W}from"./commonArgTypes-DcjzA9l3.js";import"./preload-helper-Dp1pzeXC.js";import"./AssistiveElement-BX1CLCG3.js";import"./useFormControl-CCBjUjcD.js";import"./memoTheme-DuK-uO2q.js";import"./styled-CVDphjR5.js";import"./generateUtilityClass-BtcU_pBl.js";import"./generateUtilityClasses-DDbjFgb8.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./FormControlLayout-CxLXgHi1.js";import"./isMuiElement-DGxPhrgs.js";import"./WithReadOnlyWrapper-CTB5FDTb.js";import"./InputBase-eM2MzAVe.js";import"./useForkRef-BlrSiLQa.js";import"./ownerDocument-DW-IO8s5.js";import"./getActiveElement-BwNsGdKK.js";import"./ownerWindow-HkKU3E4x.js";import"./useEventCallback-guZE-voT.js";import"./debounce-Be36O1Ab.js";import"./isHostComponent-DVu5iVWx.js";const Q={title:"UI-Kit/FormControlWrapper",component:F,tags:["autodocs"],parameters:{docs:{description:{component:"The `FormControlWrapper` is the ultimate structural replacement for built-in wrapper layouts. By centralizing label tracking, error rendering, ARIA generation, and grid layouts natively inside this single component, we achieve pixel-perfect layout compliance while retaining MUI's internal `useFormControl` Context natively.\n\n### Usage with Naked Primitives\nThis component wraps 'naked' elements directly. The demonstration stories below utilize `<TextField>` as a native display vehicle, since `<TextField>` natively pipes all its properties structurally back into this wrapper."}},controls:{include:["error","assistiveText","assistiveWithIcon","required","formLayout","labelSize","labelAlignment","labelOptionalText","labelWithEditIcon","labelActionArea"]}},argTypes:{...W,error:{control:"text",description:"Error string driving native assistive component and validation markers."},assistiveText:{control:"text",description:"Helper instructions safely dynamically anchored below the input box."},assistiveWithIcon:{control:"boolean"},required:{control:"boolean"}}},s=({...n})=>o.jsx(k,{placeholder:"Form Control primitive mapped...",...n}),e={args:{label:"Account Username",formLayout:"stacked",assistiveText:"Validation occurs immediately natively."},render:s},r={args:{label:"Encryption Protocol",formLayout:"stacked",error:"Strict validation limits reached. Handshake rejected securely."},render:s},t={args:{label:"Root Password",formLayout:"side-by-side",required:!0,assistiveText:"Bypass string structure required to initiate protocol."},render:s},i={args:{label:"Server Domain",assistiveText:"A standard text boundary without default native icon parameters bounding.",assistiveWithIcon:!1},render:s},a={parameters:{docs:{description:{story:"Bypassing the TextField map to show exactly how native `<input>` hooks execute inside the raw wrapper natively perfectly."}}},args:{label:"Raw HTML Checkbox",formLayout:"side-by-side",assistiveText:"This wraps a raw HTML input tag mapping correctly."},render:({...n})=>o.jsx("div",{style:{display:"flex",gap:"10px",alignItems:"center"},children:o.jsx(F,{...n,children:o.jsx("input",{type:"checkbox",style:{margin:0,width:"16px",height:"16px"}})})})};var l,c,p;e.parameters={...e.parameters,docs:{...(l=e.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    label: "Account Username",
    formLayout: "stacked",
    assistiveText: "Validation occurs immediately natively."
  },
  render: renderWithTextField
}`,...(p=(c=e.parameters)==null?void 0:c.docs)==null?void 0:p.source}}};var d,m,u;r.parameters={...r.parameters,docs:{...(d=r.parameters)==null?void 0:d.docs,source:{originalSource:`{
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
}`,...(b=(v=i.parameters)==null?void 0:v.docs)==null?void 0:b.source}}};var T,f,w;a.parameters={...a.parameters,docs:{...(T=a.parameters)==null?void 0:T.docs,source:{originalSource:`{
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
  render: ({
    ...args
  }: any) => <div style={{
    display: "flex",
    gap: "10px",
    alignItems: "center"
  }}>
      <FormControlWrapper {...args}>
        <input type="checkbox" style={{
        margin: 0,
        width: "16px",
        height: "16px"
      }} />
      </FormControlWrapper>
    </div>
}`,...(w=(f=a.parameters)==null?void 0:f.docs)==null?void 0:w.source}}};const X=["Default","VisualErrorState","RequiredArchitecture","WithoutAssistiveIcons","NativeChildrenDirectly"];export{e as Default,a as NativeChildrenDirectly,t as RequiredArchitecture,r as VisualErrorState,i as WithoutAssistiveIcons,X as __namedExportsOrder,Q as default};

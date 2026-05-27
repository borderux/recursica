import{j as e}from"./iframe-C_ymJL69.js";import{A as i}from"./AssistiveElement-BX1CLCG3.js";import"./preload-helper-Dp1pzeXC.js";import"./useFormControl-CCBjUjcD.js";import"./memoTheme-DuK-uO2q.js";import"./styled-CVDphjR5.js";import"./generateUtilityClass-BtcU_pBl.js";import"./generateUtilityClasses-DDbjFgb8.js";const S={title:"UI-Kit/AssistiveElement",component:i,tags:["autodocs"],parameters:{docs:{description:{component:"The `AssistiveElement` is a semantic structural primitive designed to standardize Helper and Error descriptive blocks natively beneath form components globally. By explicitly wiring to the `--recursica_ui-kit_components_assistive-element` layout tokens, this component safely injects custom SVGs (Alerts vs Info circles) alongside constrained flex-wrapping typography strings, preserving flawless line-height and alignment logic entirely decoupled from underlying input engine frameworks."}},controls:{include:["assistiveVariant","assistiveWithIcon","children"]}},argTypes:{assistiveVariant:{control:"radio",options:["help","error"]},assistiveWithIcon:{control:"boolean"}}},n={args:{children:"This is a standard assistive layout explaining specific configurations.",assistiveVariant:"help",assistiveWithIcon:!0},render:({...s})=>e.jsx("div",{style:{padding:"48px"},children:e.jsx(i,{...s})})},t={args:{children:"Invalid property. You must satisfy the constraints outlined above.",assistiveVariant:"error",assistiveWithIcon:!0},render:({...s})=>e.jsx("div",{style:{padding:"48px"},children:e.jsx(i,{...s})})},r={args:{children:"Fallback textual representation without visual injection targets.",assistiveVariant:"help",assistiveWithIcon:!1},render:({...s})=>e.jsx("div",{style:{padding:"48px"},children:e.jsx(i,{...s})})},a={args:{children:"Docs explicitly mapped configuration.",assistiveVariant:"help",assistiveWithIcon:!0},render:({...s})=>e.jsx("div",{style:{padding:"48px"},children:e.jsx(i,{...s})})};var o,l,c;n.parameters={...n.parameters,docs:{...(o=n.parameters)==null?void 0:o.docs,source:{originalSource:`{
  args: {
    children: "This is a standard assistive layout explaining specific configurations.",
    assistiveVariant: "help",
    assistiveWithIcon: true
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    ...args
  }: any) => <div style={{
    padding: "48px"
  }}>
      <AssistiveElement {...args} />
    </div>
}`,...(c=(l=n.parameters)==null?void 0:l.docs)==null?void 0:c.source}}};var p,d,u;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    children: "Invalid property. You must satisfy the constraints outlined above.",
    assistiveVariant: "error",
    assistiveWithIcon: true
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    ...args
  }: any) => <div style={{
    padding: "48px"
  }}>
      <AssistiveElement {...args} />
    </div>
}`,...(u=(d=t.parameters)==null?void 0:d.docs)==null?void 0:u.source}}};var v,m,g;r.parameters={...r.parameters,docs:{...(v=r.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    children: "Fallback textual representation without visual injection targets.",
    assistiveVariant: "help",
    assistiveWithIcon: false
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    ...args
  }: any) => <div style={{
    padding: "48px"
  }}>
      <AssistiveElement {...args} />
    </div>
}`,...(g=(m=r.parameters)==null?void 0:m.docs)==null?void 0:g.source}}};var h,y,x;a.parameters={...a.parameters,docs:{...(h=a.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    children: "Docs explicitly mapped configuration.",
    assistiveVariant: "help",
    assistiveWithIcon: true
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    ...args
  }: any) => <div style={{
    padding: "48px"
  }}>
      <AssistiveElement {...args} />
    </div>
}`,...(x=(y=a.parameters)==null?void 0:y.docs)==null?void 0:x.source}}};const k=["DefaultHelp","ErrorState","NoIconHelp","Docs"];export{n as DefaultHelp,a as Docs,t as ErrorState,r as NoIconHelp,k as __namedExportsOrder,S as default};

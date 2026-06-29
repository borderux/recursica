import{j as e,g as a}from"./iframe-BTksmf0I.js";import{A as r}from"./AssistiveElement-p7SLsC02.js";import"./preload-helper-Dp1pzeXC.js";import"./useFormControl-Bco-kS0q.js";import"./memoTheme-vMW9oVsi.js";import"./styled-C6tCmiHg.js";import"./generateUtilityClasses-DGi4yQgU.js";const E={title:"UI-Kit/AssistiveElement",component:r,tags:["autodocs"],parameters:{docs:{description:{component:"The `AssistiveElement` is a semantic structural primitive designed to standardize Helper and Error descriptive blocks natively beneath form components globally. By explicitly wiring to the `--recursica_ui-kit_components_assistive-element` layout tokens, this component safely injects custom SVGs (Alerts vs Info circles) alongside constrained flex-wrapping typography strings, preserving flawless line-height and alignment logic entirely decoupled from underlying input engine frameworks."}}},argTypes:{assistiveVariant:{control:"radio",options:["help","error"]},assistiveWithIcon:{control:"boolean"}}},t={args:{children:"This is a standard assistive layout explaining specific configurations.",assistiveVariant:"help",assistiveWithIcon:!0},render:({withLayer:o,layer:l,...s})=>e.jsx(a,{layer:0,style:{padding:"48px"},children:e.jsx(r,{...s})})},n={args:{children:"Invalid property. You must satisfy the constraints outlined above.",assistiveVariant:"error",assistiveWithIcon:!0},render:({withLayer:o,layer:l,...s})=>e.jsx(a,{layer:0,style:{padding:"48px"},children:e.jsx(r,{...s})})},i={args:{children:"Fallback textual representation without visual injection targets.",assistiveVariant:"help",assistiveWithIcon:!1},render:({withLayer:o,layer:l,...s})=>e.jsx(a,{layer:0,style:{padding:"48px"},children:e.jsx(r,{...s})})};var p,c,d;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    children: "This is a standard assistive layout explaining specific configurations.",
    assistiveVariant: "help",
    assistiveWithIcon: true
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => <Layer layer={0} style={{
    padding: "48px"
  }}>
      <AssistiveElement {...args} />
    </Layer>
}`,...(d=(c=t.parameters)==null?void 0:c.docs)==null?void 0:d.source}}};var y,u,m;n.parameters={...n.parameters,docs:{...(y=n.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    children: "Invalid property. You must satisfy the constraints outlined above.",
    assistiveVariant: "error",
    assistiveWithIcon: true
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => <Layer layer={0} style={{
    padding: "48px"
  }}>
      <AssistiveElement {...args} />
    </Layer>
}`,...(m=(u=n.parameters)==null?void 0:u.docs)==null?void 0:m.source}}};var g,h,v;i.parameters={...i.parameters,docs:{...(g=i.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    children: "Fallback textual representation without visual injection targets.",
    assistiveVariant: "help",
    assistiveWithIcon: false
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => <Layer layer={0} style={{
    padding: "48px"
  }}>
      <AssistiveElement {...args} />
    </Layer>
}`,...(v=(h=i.parameters)==null?void 0:h.docs)==null?void 0:v.source}}};const A=["DefaultHelp","ErrorState","NoIconHelp"];export{t as DefaultHelp,n as ErrorState,i as NoIconHelp,A as __namedExportsOrder,E as default};

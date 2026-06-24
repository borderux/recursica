import{j as e,R as a}from"./iframe-oYtE5cjn.js";import{A as r}from"./AssistiveElement-BCVSpv8J.js";import"./preload-helper-Dp1pzeXC.js";const w={title:"UI-Kit/AssistiveElement",component:r,tags:["autodocs"],parameters:{docs:{description:{component:"The `AssistiveElement` is a semantic structural primitive designed to standardize Helper and Error descriptive blocks natively beneath form components globally. By explicitly wiring to the `--recursica_ui-kit_components_assistive-element` layout tokens, this component safely injects custom SVGs (Alerts vs Info circles) alongside constrained flex-wrapping typography strings, preserving flawless line-height and alignment logic entirely decoupled from underlying input engine frameworks."}}},argTypes:{assistiveVariant:{control:"radio",options:["help","error"]},assistiveWithIcon:{control:"boolean"}}},n={args:{children:"This is a standard assistive layout explaining specific configurations.",assistiveVariant:"help",assistiveWithIcon:!0},render:({withLayer:o,layer:l,...s})=>e.jsx(a,{layer:0,style:{padding:"48px"},children:e.jsx(r,{...s})})},t={args:{children:"Invalid property. You must satisfy the constraints outlined above.",assistiveVariant:"error",assistiveWithIcon:!0},render:({withLayer:o,layer:l,...s})=>e.jsx(a,{layer:0,style:{padding:"48px"},children:e.jsx(r,{...s})})},i={args:{children:"Fallback textual representation without visual injection targets.",assistiveVariant:"help",assistiveWithIcon:!1},render:({withLayer:o,layer:l,...s})=>e.jsx(a,{layer:0,style:{padding:"48px"},children:e.jsx(r,{...s})})};var c,p,d;n.parameters={...n.parameters,docs:{...(c=n.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
}`,...(d=(p=n.parameters)==null?void 0:p.docs)==null?void 0:d.source}}};var y,u,g;t.parameters={...t.parameters,docs:{...(y=t.parameters)==null?void 0:y.docs,source:{originalSource:`{
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
}`,...(g=(u=t.parameters)==null?void 0:u.docs)==null?void 0:g.source}}};var m,h,v;i.parameters={...i.parameters,docs:{...(m=i.parameters)==null?void 0:m.docs,source:{originalSource:`{
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
}`,...(v=(h=i.parameters)==null?void 0:h.docs)==null?void 0:v.source}}};const L=["DefaultHelp","ErrorState","NoIconHelp"];export{n as DefaultHelp,t as ErrorState,i as NoIconHelp,L as __namedExportsOrder,w as default};

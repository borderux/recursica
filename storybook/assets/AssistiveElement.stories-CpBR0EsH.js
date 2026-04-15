import{j as e,$ as n}from"./iframe-d8_mgu_F.js";import{A as i}from"./AssistiveElement-Cio2Zk0-.js";import"./preload-helper-Dp1pzeXC.js";const f={title:"UI-Kit/AssistiveElement",component:i,tags:["autodocs"],parameters:{docs:{description:{component:"The `AssistiveElement` is a semantic structural primitive designed to standardize Helper and Error descriptive blocks natively beneath form components globally. By explicitly wiring to the `--recursica_ui-kit_components_assistive-element` layout tokens, this component safely injects custom SVGs (Alerts vs Info circles) alongside constrained flex-wrapping typography strings, preserving flawless line-height and alignment logic entirely decoupled from underlying input engine frameworks."}}},argTypes:{assistiveVariant:{control:"radio",options:["help","error"]},assistiveWithIcon:{control:"boolean"}}},r={args:{children:"This is a standard assistive layout explaining specific configurations.",assistiveVariant:"help",assistiveWithIcon:!0},render:s=>e.jsx(n,{layer:0,style:{padding:"48px"},children:e.jsx(i,{...s})})},t={args:{children:"Invalid property. You must satisfy the constraints outlined above.",assistiveVariant:"error",assistiveWithIcon:!0},render:s=>e.jsx(n,{layer:0,style:{padding:"48px"},children:e.jsx(i,{...s})})},a={args:{children:"Fallback textual representation without visual injection targets.",assistiveVariant:"help",assistiveWithIcon:!1},render:s=>e.jsx(n,{layer:0,style:{padding:"48px"},children:e.jsx(i,{...s})})};var o,l,c;r.parameters={...r.parameters,docs:{...(o=r.parameters)==null?void 0:o.docs,source:{originalSource:`{
  args: {
    children: "This is a standard assistive layout explaining specific configurations.",
    assistiveVariant: "help",
    assistiveWithIcon: true
  },
  render: args => <Layer layer={0} style={{
    padding: "48px"
  }}>
      <AssistiveElement {...args} />
    </Layer>
}`,...(c=(l=r.parameters)==null?void 0:l.docs)==null?void 0:c.source}}};var p,d,u;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    children: "Invalid property. You must satisfy the constraints outlined above.",
    assistiveVariant: "error",
    assistiveWithIcon: true
  },
  render: args => <Layer layer={0} style={{
    padding: "48px"
  }}>
      <AssistiveElement {...args} />
    </Layer>
}`,...(u=(d=t.parameters)==null?void 0:d.docs)==null?void 0:u.source}}};var g,m,y;a.parameters={...a.parameters,docs:{...(g=a.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    children: "Fallback textual representation without visual injection targets.",
    assistiveVariant: "help",
    assistiveWithIcon: false
  },
  render: args => <Layer layer={0} style={{
    padding: "48px"
  }}>
      <AssistiveElement {...args} />
    </Layer>
}`,...(y=(m=a.parameters)==null?void 0:m.docs)==null?void 0:y.source}}};const I=["DefaultHelp","ErrorState","NoIconHelp"];export{r as DefaultHelp,t as ErrorState,a as NoIconHelp,I as __namedExportsOrder,f as default};

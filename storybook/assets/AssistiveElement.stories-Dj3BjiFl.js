import{j as e}from"./iframe-uF_HBlgp.js";import{A as a}from"./AssistiveElement-D6QK6qk4.js";import{T as n}from"./adapter-common-DIDtRk04.js";import"./preload-helper-Dp1pzeXC.js";import"./filterStylingProps-Cd5Jg4Cp.js";const j={title:"UI-Kit/AssistiveElement",component:a,tags:["autodocs"],parameters:{docs:{description:{component:"The `AssistiveElement` is a semantic structural primitive designed to standardize Helper and Error descriptive blocks natively beneath form components globally. By explicitly wiring to the `--recursica_ui-kit_components_assistive-element` layout tokens, this component safely injects custom SVGs (Alerts vs Info circles) alongside constrained flex-wrapping typography strings, preserving flawless line-height and alignment logic entirely decoupled from underlying input engine frameworks."}}},argTypes:{assistiveVariant:{control:"radio",options:["help","error"]},assistiveWithIcon:{control:"boolean"}}},r={args:{children:"This is a standard assistive layout explaining specific configurations.",assistiveVariant:"help",assistiveWithIcon:!0},render:s=>e.jsx(n,{layer:0,style:{padding:"48px"},children:e.jsx(a,{...s})})},t={args:{children:"Invalid property. You must satisfy the constraints outlined above.",assistiveVariant:"error",assistiveWithIcon:!0},render:s=>e.jsx(n,{layer:0,style:{padding:"48px"},children:e.jsx(a,{...s})})},i={args:{children:"Fallback textual representation without visual injection targets.",assistiveVariant:"help",assistiveWithIcon:!1},render:s=>e.jsx(n,{layer:0,style:{padding:"48px"},children:e.jsx(a,{...s})})};var o,l,c;r.parameters={...r.parameters,docs:{...(o=r.parameters)==null?void 0:o.docs,source:{originalSource:`{
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
}`,...(c=(l=r.parameters)==null?void 0:l.docs)==null?void 0:c.source}}};var p,d,m;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
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
}`,...(m=(d=t.parameters)==null?void 0:d.docs)==null?void 0:m.source}}};var u,g,y;i.parameters={...i.parameters,docs:{...(u=i.parameters)==null?void 0:u.docs,source:{originalSource:`{
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
}`,...(y=(g=i.parameters)==null?void 0:g.docs)==null?void 0:y.source}}};const E=["DefaultHelp","ErrorState","NoIconHelp"];export{r as DefaultHelp,t as ErrorState,i as NoIconHelp,E as __namedExportsOrder,j as default};

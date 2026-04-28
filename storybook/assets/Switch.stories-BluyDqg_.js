import{j as e}from"./iframe-BHhWYZEC.js";import{S as a}from"./Switch-C4en500y.js";import"./preload-helper-Dp1pzeXC.js";import"./FormControlWrapper-DwDdR9YI.js";import"./get-size-BlbtXTyo.js";import"./factory-CVE1eDgt.js";import"./polymorphic-factory-CnLU5YW3.js";import"./create-optional-context-Bh_A6Tr4.js";import"./UnstyledButton-BRfGAqO1.js";import"./use-id-DcQsRQI5.js";import"./AssistiveElement-DUObxgOi.js";import"./InputsGroupFieldset-CzHCkDyZ.js";import"./use-uncontrolled-D82D5WRd.js";import"./CheckIcon-DHRuJiOF.js";const R={title:"UI-Kit/Switch",component:a,tags:["autodocs"],parameters:{docs:{description:{component:'\nThe `Switch` component is an atomic form primitive representing boolean states, natively aligned to the Recursica design system.\n\n> [!IMPORTANT]  \n> Unlike `Checkbox`, the `Switch` is typically used for standalone settings toggles. It fully supports the universal `ReadOnlyField` boundaries when passed the `readOnly` attribute.\n\n### Usage\nTo render a standard switch:\n```tsx\n<Switch label="Enable Notifications" defaultChecked />\n```\n'}}},argTypes:{disabled:{control:"boolean"},checked:{control:"boolean"},required:{control:"boolean"},error:{control:"boolean"},defaultChecked:{control:"boolean"},readOnly:{control:"boolean",description:"Toggles structural read-only data presentation bypassing interaction boundaries completely."}}},t={args:{disabled:!1,label:"Standard Switch"}},r={args:{},render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"24px"},children:[e.jsx(a,{label:"Default Unchecked State"}),e.jsx(a,{label:"Checked State",defaultChecked:!0}),e.jsx(a,{label:"Disabled Unchecked",disabled:!0}),e.jsx(a,{label:"Disabled Checked",defaultChecked:!0,disabled:!0})]})},n={args:{},render:()=>e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"24px"},children:e.jsx(a,{label:"Read Only Switch",readOnly:!0,readOnlyComponent:e.jsx("span",{children:"Enabled"})})})};var l,s,o;t.parameters={...t.parameters,docs:{...(l=t.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    disabled: false,
    label: "Standard Switch"
  }
}`,...(o=(s=t.parameters)==null?void 0:s.docs)==null?void 0:o.source}}};var i,d,c;r.parameters={...r.parameters,docs:{...(i=r.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {},
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "24px"
  }}>
      <Switch label="Default Unchecked State" />
      <Switch label="Checked State" defaultChecked />
      <Switch label="Disabled Unchecked" disabled />
      <Switch label="Disabled Checked" defaultChecked disabled />
    </div>
}`,...(c=(d=r.parameters)==null?void 0:d.docs)==null?void 0:c.source}}};var p,m,u;n.parameters={...n.parameters,docs:{...(p=n.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {},
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "24px"
  }}>
      <Switch label="Read Only Switch" readOnly readOnlyComponent={<span>Enabled</span>} />
    </div>
}`,...(u=(m=n.parameters)==null?void 0:m.docs)==null?void 0:u.source}}};const U=["Default","StaticVariations","StaticReadOnly"];export{t as Default,n as StaticReadOnly,r as StaticVariations,U as __namedExportsOrder,R as default};

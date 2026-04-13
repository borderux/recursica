import{j as e}from"./iframe-Cfrmv-sD.js";import{C as a}from"./Checkbox-DG0Ln3f8.js";import"./preload-helper-Dp1pzeXC.js";import"./FormControlWrapper-XFze9NYg.js";import"./get-size-0ZAaIumh.js";import"./factory-B3pmeTAA.js";import"./polymorphic-factory-F4O7v52k.js";import"./create-optional-context-DKB1ywIg.js";import"./UnstyledButton-dfWf7gTY.js";import"./use-id-DgIgn6iy.js";import"./AssistiveElement-X6WZVyQ_.js";import"./use-uncontrolled-BHqT_4Oo.js";import"./CheckIcon-DQXrH9gO.js";const T={title:"UI-Kit/Checkbox",component:a,tags:["autodocs"],parameters:{docs:{description:{component:'\nThe `Checkbox` component is a precisely engineered, atomic form primitive representing boolean states natively aligned to the Recursica design system. It overrides Mantine\'s standard properties explicitly enforcing our variables natively across all structural boundaries.\n\n> [!IMPORTANT]  \n> The atomic `Checkbox` is intended primarily as an internal primitive. **When wrapping multiple Checkbox elements together or rendering form controls, always utilize the `<Checkbox.Group>` component.** `Checkbox.Group` inherits the global `FormControlWrapper`, granting instantaneous access to macroscopic layout structuring, assistive descriptions, validation errors, and strict flex arrays.\n\n### Usage\nTo render a solitary component natively:\n```tsx\n<Checkbox label="Acknowledge Terms" defaultChecked />\n```\n'}}},argTypes:{disabled:{control:"boolean"},readOnly:{control:"boolean",description:"Toggles structural read-only data presentation bypassing interaction boundaries completely."}}},t={args:{disabled:!1,label:"Standard Unchecked Property"}},r={args:{label:"A meticulously long Checkbox label property demonstrating the absolute maximum 400px wrapper constraints actively snapping the text engine down onto a secondary wrapping line automatically without blowing out the visual boundaries."}},o={args:{},render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"24px"},children:[e.jsx(a,{label:"Default Unchecked State"}),e.jsx(a,{label:"Acknowledge Configuration",defaultChecked:!0}),e.jsx(a,{label:"Indeterminate Master",indeterminate:!0}),e.jsx(a,{label:"Disabled Variant",disabled:!0}),e.jsx(a,{label:"Disabled Checked Variant",checked:!0,disabled:!0})]})};var n,i,s;t.parameters={...t.parameters,docs:{...(n=t.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    disabled: false,
    label: "Standard Unchecked Property"
  }
}`,...(s=(i=t.parameters)==null?void 0:i.docs)==null?void 0:s.source}}};var l,c,d;r.parameters={...r.parameters,docs:{...(l=r.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    label: "A meticulously long Checkbox label property demonstrating the absolute maximum 400px wrapper constraints actively snapping the text engine down onto a secondary wrapping line automatically without blowing out the visual boundaries."
  }
}`,...(d=(c=r.parameters)==null?void 0:c.docs)==null?void 0:d.source}}};var p,m,u;o.parameters={...o.parameters,docs:{...(p=o.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {},
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "24px"
  }}>
      <Checkbox label="Default Unchecked State" />
      <Checkbox label="Acknowledge Configuration" defaultChecked />
      <Checkbox label="Indeterminate Master" indeterminate />
      <Checkbox label="Disabled Variant" disabled />
      <Checkbox label="Disabled Checked Variant" checked disabled />
    </div>
}`,...(u=(m=o.parameters)==null?void 0:m.docs)==null?void 0:u.source}}};const A=["Default","LongLabelWrap","StaticVariations"];export{t as Default,r as LongLabelWrap,o as StaticVariations,A as __namedExportsOrder,T as default};

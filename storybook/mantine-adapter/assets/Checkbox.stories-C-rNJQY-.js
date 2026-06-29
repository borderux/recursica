import{j as e}from"./iframe-DyBNPiC1.js";import{C as a}from"./Checkbox-CRcH6x-O.js";import"./preload-helper-Dp1pzeXC.js";import"./WithReadOnlyWrapper-BEFaaN92.js";import"./ReadOnlyField-Ce_Eike0.js";import"./get-size-D2StqF49.js";import"./factory-BCJdCO96.js";import"./polymorphic-factory-CUMspToA.js";import"./create-optional-context-4aTJBr7t.js";import"./use-resolved-styles-api-D-Jb7eJi.js";import"./CloseButton-CuQ2F95T.js";import"./UnstyledButton-pll0nim4.js";import"./use-id-Dew4zDnN.js";import"./AssistiveElement-D58-8os0.js";import"./get-auto-contrast-value-Da6zqqWm.js";import"./InputsGroupFieldset-CVsyeAa9.js";import"./use-uncontrolled-DQCKd1AO.js";import"./CheckIcon-B9mcyVJk.js";const G={title:"UI-Kit/Checkbox",component:a,tags:["autodocs"],parameters:{docs:{description:{component:'\nThe `Checkbox` component is a precisely engineered, atomic form primitive representing boolean states natively aligned to the Recursica design system. It overrides Mantine\'s standard properties explicitly enforcing our variables natively across all structural boundaries.\n\n> [!IMPORTANT]  \n> The atomic `Checkbox` is intended primarily as an internal primitive. **When wrapping multiple Checkbox elements together or rendering form controls, always utilize the `<Checkbox.Group>` component.** `Checkbox.Group` inherits the global `FormControlWrapper`, granting instantaneous access to macroscopic layout structuring, assistive descriptions, validation errors, and strict flex arrays.\n\n### Usage\nTo render a solitary component natively:\n```tsx\n<Checkbox label="Acknowledge Terms" defaultChecked />\n```\n'}}},argTypes:{disabled:{control:"boolean"},readOnly:{control:"boolean",description:"Toggles structural read-only data presentation bypassing interaction boundaries completely."},controlMaxWidth:{table:{disable:!0}},controlMinWidth:{table:{disable:!0}}}},r={args:{disabled:!1,label:"Standard Unchecked Property"}},t={args:{label:"Opt-in form alignment",formLayout:"side-by-side"}},o={args:{label:"A meticulously long Checkbox label property demonstrating the absolute maximum 400px wrapper constraints actively snapping the text engine down onto a secondary wrapping line automatically without blowing out the visual boundaries."}},n={args:{},render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"24px"},children:[e.jsx(a,{label:"Default Unchecked State"}),e.jsx(a,{label:"Acknowledge Configuration",defaultChecked:!0}),e.jsx(a,{label:"Indeterminate Master",indeterminate:!0}),e.jsx(a,{label:"Disabled Variant",disabled:!0}),e.jsx(a,{label:"Disabled Checked Variant",checked:!0,disabled:!0})]})},i={args:{},render:()=>e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"24px"},children:e.jsx(a,{label:"Accept Terms & Conditions",defaultChecked:!0,readOnly:!0})})};var s,l,c;r.parameters={...r.parameters,docs:{...(s=r.parameters)==null?void 0:s.docs,source:{originalSource:`{
  args: {
    disabled: false,
    label: "Standard Unchecked Property"
  }
}`,...(c=(l=r.parameters)==null?void 0:l.docs)==null?void 0:c.source}}};var d,p,m;t.parameters={...t.parameters,docs:{...(d=t.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    label: "Opt-in form alignment",
    formLayout: "side-by-side"
  }
}`,...(m=(p=t.parameters)==null?void 0:p.docs)==null?void 0:m.source}}};var u,b,g;o.parameters={...o.parameters,docs:{...(u=o.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    label: "A meticulously long Checkbox label property demonstrating the absolute maximum 400px wrapper constraints actively snapping the text engine down onto a secondary wrapping line automatically without blowing out the visual boundaries."
  }
}`,...(g=(b=o.parameters)==null?void 0:b.docs)==null?void 0:g.source}}};var x,h,y;n.parameters={...n.parameters,docs:{...(x=n.parameters)==null?void 0:x.docs,source:{originalSource:`{
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
}`,...(y=(h=n.parameters)==null?void 0:h.docs)==null?void 0:y.source}}};var f,k,C;i.parameters={...i.parameters,docs:{...(f=i.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {},
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "24px"
  }}>
      <Checkbox label="Accept Terms & Conditions" defaultChecked readOnly />
    </div>
}`,...(C=(k=i.parameters)==null?void 0:k.docs)==null?void 0:C.source}}};const _=["Default","SideBySideLayout","LongLabelWrap","StaticVariations","ReadOnly"];export{r as Default,o as LongLabelWrap,i as ReadOnly,t as SideBySideLayout,n as StaticVariations,_ as __namedExportsOrder,G as default};

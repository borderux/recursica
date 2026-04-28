import{j as S}from"./iframe-BHhWYZEC.js";import{R as C}from"./Radio-9w-i5CkK.js";import"./preload-helper-Dp1pzeXC.js";import"./FormControlWrapper-DwDdR9YI.js";import"./get-size-BlbtXTyo.js";import"./factory-CVE1eDgt.js";import"./polymorphic-factory-CnLU5YW3.js";import"./create-optional-context-Bh_A6Tr4.js";import"./UnstyledButton-BRfGAqO1.js";import"./use-id-DcQsRQI5.js";import"./AssistiveElement-DUObxgOi.js";import"./get-auto-contrast-value-Da6zqqWm.js";import"./InputsGroupFieldset-CzHCkDyZ.js";import"./DirectionProvider-IIno09RO.js";import"./use-uncontrolled-D82D5WRd.js";const V={title:"UI-Kit/Radio",component:C,tags:["autodocs"],parameters:{docs:{description:{component:'\nThe `Radio` component represents a fundamental standalone boolean selection node mapping to the native HTML `<input type="radio">`. \n\n> [!WARNING]\n> This component represents the isolated primitive structure. If you need macro form configurations, standard vertical alignments, side-by-side array wrappers, or integrated assistive text and error borders natively, you MUST use the `<Radio.Group>` orchestrator instead!\n'}}},argTypes:{disabled:{control:"boolean"},checked:{control:"boolean"},readOnly:{control:"boolean"},error:{control:"boolean"},defaultChecked:{control:"boolean"}}},e={args:{label:"Standard Radio Primitive"}},r={args:{...e.args,defaultChecked:!0}},a={args:{...e.args,disabled:!0}},o={args:{...e.args,disabled:!0,defaultChecked:!0}},t={args:{readOnly:!0,readOnlyComponent:S.jsx("span",{children:"Locked Native Value"})}};var s,n,d;e.parameters={...e.parameters,docs:{...(s=e.parameters)==null?void 0:s.docs,source:{originalSource:`{
  args: {
    label: "Standard Radio Primitive"
  }
}`,...(d=(n=e.parameters)==null?void 0:n.docs)==null?void 0:d.source}}};var i,c,l;r.parameters={...r.parameters,docs:{...(i=r.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    defaultChecked: true
  }
}`,...(l=(c=r.parameters)==null?void 0:c.docs)==null?void 0:l.source}}};var p,m,u;a.parameters={...a.parameters,docs:{...(p=a.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    disabled: true
  }
}`,...(u=(m=a.parameters)==null?void 0:m.docs)==null?void 0:u.source}}};var g,b,h;o.parameters={...o.parameters,docs:{...(g=o.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    disabled: true,
    defaultChecked: true
  }
}`,...(h=(b=o.parameters)==null?void 0:b.docs)==null?void 0:h.source}}};var f,k,y;t.parameters={...t.parameters,docs:{...(f=t.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    readOnly: true,
    readOnlyComponent: <span>Locked Native Value</span>
  }
}`,...(y=(k=t.parameters)==null?void 0:k.docs)==null?void 0:y.source}}};const _=["Default","CheckedState","DisabledUnchecked","DisabledChecked","ReadOnlyStandalone"];export{r as CheckedState,e as Default,o as DisabledChecked,a as DisabledUnchecked,t as ReadOnlyStandalone,_ as __namedExportsOrder,V as default};

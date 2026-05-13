import{j as e}from"./iframe-BddUskqo.js";import{S as t}from"./Switch-BcJxOyUE.js";import{S as j}from"./Stack-h-TWIS18.js";import"./preload-helper-Dp1pzeXC.js";import"./ReadOnlyField-BUyHCQbv.js";import"./get-size-D6NM-3-T.js";import"./factory-CvawFnU2.js";import"./polymorphic-factory-htL0-wIS.js";import"./create-optional-context-DWcZ-Trh.js";import"./use-resolved-styles-api--I-5TNCE.js";import"./CloseButton-a_V5wulq.js";import"./UnstyledButton-Cpkh_G9M.js";import"./use-id-BZWRHC0D.js";import"./AssistiveElement-CLEetnsG.js";import"./WithReadOnlyWrapper-CUNta2aS.js";import"./InputsGroupFieldset-CoXUhe9u.js";import"./use-uncontrolled-CF5v_IMa.js";import"./CheckIcon-B77z0ogW.js";const G={title:"UI-Kit/Switch",component:t,tags:["autodocs"],parameters:{docs:{description:{component:'\nThe `Switch` component is an atomic form primitive representing boolean states, natively aligned to the Recursica design system.\n\n> [!IMPORTANT]  \n> Unlike `Checkbox`, the `Switch` is typically used for standalone settings toggles. It fully supports the universal `ReadOnlyField` boundaries when passed the `readOnly` attribute.\n\n### Usage\nTo render a standard switch:\n```tsx\n<Switch label="Enable Notifications" defaultChecked />\n```\n'}}},argTypes:{checked:{control:"boolean"},required:{control:"boolean"},error:{control:"boolean"},defaultChecked:{control:"boolean"},readOnly:{control:"boolean",description:"Toggles structural read-only data presentation bypassing interaction boundaries completely."},controlMaxWidth:{table:{disable:!0}},controlMinWidth:{table:{disable:!0}},emptyValueComponent:{table:{disable:!0}}}},r={args:{disabled:!1,label:"Standard Switch"},render:({withLayer:l,layer:d,...a})=>e.jsx(t,{...a})},n={args:{label:"Opt-in form alignment",formLayout:"side-by-side"},render:({withLayer:l,layer:d,...a})=>e.jsx(t,{...a})},s={args:{},render:()=>e.jsxs(j,{gap:"xl",children:[e.jsx(t,{label:"Default Unchecked State"}),e.jsx(t,{label:"Checked State",defaultChecked:!0}),e.jsx(t,{label:"Disabled Unchecked",disabled:!0}),e.jsx(t,{label:"Disabled Checked",defaultChecked:!0,disabled:!0})]})},i={args:{...r.args,readOnly:!0},render:({withLayer:l,layer:d,...a})=>e.jsx(t,{...a})},o={args:{...r.args,readOnly:!0},render:({withLayer:l,layer:d,...a})=>e.jsx(t,{...a,readOnlyComponent:({checked:c,label:L})=>e.jsxs("span",{style:{fontWeight:"bold",color:c?"green":"red"},children:[L," ",c?"ENABLED":"DISABLED"]})})};var p,u,y;r.parameters={...r.parameters,docs:{...(p=r.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    disabled: false,
    label: "Standard Switch"
  },
  // We explicitly destructure global Storybook injected arguments so they do not leak into the DOM natively.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => <Switch {...args} />
}`,...(y=(u=r.parameters)==null?void 0:u.docs)==null?void 0:y.source}}};var m,h,b;n.parameters={...n.parameters,docs:{...(m=n.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    label: "Opt-in form alignment",
    formLayout: "side-by-side"
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => <Switch {...args} />
}`,...(b=(h=n.parameters)==null?void 0:h.docs)==null?void 0:b.source}}};var g,S,f;s.parameters={...s.parameters,docs:{...(g=s.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {},
  render: () => <Stack gap="xl">
      <Switch label="Default Unchecked State" />
      <Switch label="Checked State" defaultChecked />
      <Switch label="Disabled Unchecked" disabled />
      <Switch label="Disabled Checked" defaultChecked disabled />
    </Stack>
}`,...(f=(S=s.parameters)==null?void 0:S.docs)==null?void 0:f.source}}};var x,w,k;i.parameters={...i.parameters,docs:{...(x=i.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    readOnly: true
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => <Switch {...args} />
}`,...(k=(w=i.parameters)==null?void 0:w.docs)==null?void 0:k.source}}};var O,D,C;o.parameters={...o.parameters,docs:{...(O=o.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    readOnly: true
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => <Switch {...args} readOnlyComponent={({
    checked,
    label
  }) => <span style={{
    fontWeight: "bold",
    color: checked ? "green" : "red"
  }}>
          {label} {checked ? "ENABLED" : "DISABLED"}
        </span>} />
}`,...(C=(D=o.parameters)==null?void 0:D.docs)==null?void 0:C.source}}};const H=["Default","SideBySideLayout","StaticVariations","ReadOnly","CustomReadOnly"];export{o as CustomReadOnly,r as Default,i as ReadOnly,n as SideBySideLayout,s as StaticVariations,H as __namedExportsOrder,G as default};

import{r as o,j as e}from"./iframe-C3SWO55l.js";import{a as i,S as t}from"./Switch-D8QmA2AO.js";import{f as M}from"./commonArgTypes-DcjzA9l3.js";import"./preload-helper-Dp1pzeXC.js";import"./ReadOnlyField-C6o1-PZY.js";import"./get-size-Ducn9enw.js";import"./factory-Dz1TPLtm.js";import"./polymorphic-factory-1ktCJnHi.js";import"./create-optional-context-CoG8_cBT.js";import"./use-resolved-styles-api-C5gzC_jf.js";import"./CloseButton-CjdKMo9a.js";import"./UnstyledButton-DAw-L8mm.js";import"./use-id-CsErYGr_.js";import"./AssistiveElement-CIVOAHvy.js";import"./WithReadOnlyWrapper-BCqm6cbX.js";import"./InputsGroupFieldset-tdt1kbfi.js";import"./use-uncontrolled-x7JtAuLz.js";import"./CheckIcon-DhpOBFkW.js";const Q={title:"UI-Kit/SwitchGroup",component:i,tags:["autodocs"],parameters:{docs:{description:{component:'\nThe `SwitchGroup` component is the mandatory organizational wrapper for orchestrating `Switch` primitives into macro form layouts. It inherently leverages the `FormControlWrapper`, granting native access to structural alignments, assistive descriptions, and strict flex arrays.\n\n### Supported Layout Vectors\n- **`formLayout="stacked"`**: Top-to-bottom layout cascading the Label bounding box down vertically into a standard stacked switch array.\n- **`formLayout="side-by-side"`**: Flow architecture pulling the grouping Label dynamically to the left while structurally organizing the internal switches cleanly alongside it horizontally.\n\n> [!IMPORTANT]  \n> If you require a solitary `Switch` field to natively accept an overarching form label, assistive text, or align with other side-by-side components in a form column, you must wrap it inside a `Switch.Group` to trigger the `FormControlWrapper` mapping.\n'}}},argTypes:{...M,readOnly:{control:"boolean",description:"Passes read-only lock natively down mapping inner switches into explicitly disabled states."}}},p={args:{formLayout:"stacked",label:"Standard Group"},render:function({withLayer:u,layer:c,...a}){const[r,n]=o.useState([]);return e.jsxs(i,{...a,value:r,onChange:n,children:[e.jsx(t,{value:"1",label:"Option 1"}),e.jsx(t,{value:"2",label:"Option 2"})]})}},s={args:{formLayout:"stacked",label:"Notification Settings",description:"Manage your preferences.",assistiveText:"We recommend turning these on.",error:"",required:!0},render:function({withLayer:u,layer:c,...a}){const[r,n]=o.useState(["email"]);return e.jsxs(i,{...a,value:r,onChange:n,children:[e.jsx(t,{value:"email",label:"Email Alerts"}),e.jsx(t,{value:"push",label:"Push Notifications"}),e.jsx(t,{value:"sms",label:"SMS Messages"})]})}},d={args:{...s.args,formLayout:"side-by-side",labelSize:"default",labelAlignment:"left"},render:function({withLayer:u,layer:c,...a}){const[r,n]=o.useState([]);return e.jsxs(i,{...a,value:r,onChange:n,children:[e.jsx(t,{value:"weekly",label:"Weekly Digest"}),e.jsx(t,{value:"marketing",label:"Marketing Emails"})]})}},y={args:{formLayout:"side-by-side",label:"Enable Backups",description:"Automatically back up your data nightly."},render:function({withLayer:u,layer:c,...a}){const[r,n]=o.useState(["auto"]);return e.jsx(i,{...a,value:r,onChange:n,children:e.jsx(t,{value:"auto",label:"Auto-backup"})})}},m={args:{...s.args,readOnly:!0},render:function({withLayer:u,layer:c,...a}){const[r,n]=o.useState(["email","sms"]);return e.jsxs(i,{...a,value:r,onChange:n,children:[e.jsx(t,{value:"email",label:"Email Alerts"}),e.jsx(t,{value:"push",label:"Push Notifications"}),e.jsx(t,{value:"sms",label:"SMS Messages"})]})}};var g,h,S;p.parameters={...p.parameters,docs:{...(g=p.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    formLayout: "stacked",
    label: "Standard Group"
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: function StoryRender({
    withLayer,
    layer,
    ...args
  }: any) {
    const [value, setValue] = useState<string[]>([]);
    return <SwitchGroup {...args} value={value} onChange={setValue}>
        <Switch value="1" label="Option 1" />
        <Switch value="2" label="Option 2" />
      </SwitchGroup>;
  }
}`,...(S=(h=p.parameters)==null?void 0:h.docs)==null?void 0:S.source}}};var v,b,w;s.parameters={...s.parameters,docs:{...(v=s.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    formLayout: "stacked",
    label: "Notification Settings",
    description: "Manage your preferences.",
    assistiveText: "We recommend turning these on.",
    error: "",
    required: true
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: function StoryRender({
    withLayer,
    layer,
    ...args
  }: any) {
    const [value, setValue] = useState<string[]>(["email"]);
    return <SwitchGroup {...args} value={value} onChange={setValue}>
        <Switch value="email" label="Email Alerts" />
        <Switch value="push" label="Push Notifications" />
        <Switch value="sms" label="SMS Messages" />
      </SwitchGroup>;
  }
}`,...(w=(b=s.parameters)==null?void 0:b.docs)==null?void 0:w.source}}};var f,x,L;d.parameters={...d.parameters,docs:{...(f=d.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    ...StackedLayout.args,
    formLayout: "side-by-side",
    labelSize: "default",
    labelAlignment: "left"
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: function StoryRender({
    withLayer,
    layer,
    ...args
  }: any) {
    const [value, setValue] = useState<string[]>([]);
    return <SwitchGroup {...args} value={value} onChange={setValue}>
        <Switch value="weekly" label="Weekly Digest" />
        <Switch value="marketing" label="Marketing Emails" />
      </SwitchGroup>;
  }
}`,...(L=(x=d.parameters)==null?void 0:x.docs)==null?void 0:L.source}}};var k,j,G;y.parameters={...y.parameters,docs:{...(k=y.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    formLayout: "side-by-side",
    label: "Enable Backups",
    description: "Automatically back up your data nightly."
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: function StoryRender({
    withLayer,
    layer,
    ...args
  }: any) {
    const [value, setValue] = useState<string[]>(["auto"]);
    return <SwitchGroup {...args} value={value} onChange={setValue}>
        <Switch value="auto" label="Auto-backup" />
      </SwitchGroup>;
  }
}`,...(G=(j=y.parameters)==null?void 0:j.docs)==null?void 0:G.source}}};var V,C,R;m.parameters={...m.parameters,docs:{...(V=m.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    ...StackedLayout.args,
    readOnly: true
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: function StoryRender({
    withLayer,
    layer,
    ...args
  }: any) {
    const [value, setValue] = useState<string[]>(["email", "sms"]);
    return <SwitchGroup {...args} value={value} onChange={setValue}>
        <Switch value="email" label="Email Alerts" />
        <Switch value="push" label="Push Notifications" />
        <Switch value="sms" label="SMS Messages" />
      </SwitchGroup>;
  }
}`,...(R=(C=m.parameters)==null?void 0:C.docs)==null?void 0:R.source}}};const X=["Default","StackedLayout","SideBySideLayout","SolitaryFormControl","ReadOnly"];export{p as Default,m as ReadOnly,d as SideBySideLayout,y as SolitaryFormControl,s as StackedLayout,X as __namedExportsOrder,Q as default};

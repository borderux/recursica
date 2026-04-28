import{r as c,j as e}from"./iframe-BHhWYZEC.js";import{a as o,S as a}from"./Switch-C4en500y.js";import{f as j}from"./commonArgTypes-DcjzA9l3.js";import"./preload-helper-Dp1pzeXC.js";import"./FormControlWrapper-DwDdR9YI.js";import"./get-size-BlbtXTyo.js";import"./factory-CVE1eDgt.js";import"./polymorphic-factory-CnLU5YW3.js";import"./create-optional-context-Bh_A6Tr4.js";import"./UnstyledButton-BRfGAqO1.js";import"./use-id-DcQsRQI5.js";import"./AssistiveElement-DUObxgOi.js";import"./InputsGroupFieldset-CzHCkDyZ.js";import"./use-uncontrolled-D82D5WRd.js";import"./CheckIcon-DHRuJiOF.js";const z={title:"UI-Kit/SwitchGroup",component:o,tags:["autodocs"],parameters:{docs:{description:{component:'\nThe `SwitchGroup` component is the mandatory organizational wrapper for orchestrating `Switch` primitives into macro form layouts. It inherently leverages the `FormControlWrapper`, granting native access to structural alignments, assistive descriptions, and strict flex arrays.\n\n### Supported Layout Vectors\n- **`formLayout="stacked"`**: Top-to-bottom layout cascading the Label bounding box down vertically into a standard stacked switch array.\n- **`formLayout="side-by-side"`**: Flow architecture pulling the grouping Label dynamically to the left while structurally organizing the internal switches cleanly alongside it horizontally.\n\n> [!IMPORTANT]  \n> If you require a solitary `Switch` field to natively accept an overarching form label, assistive text, or align with other side-by-side components in a form column, you must wrap it inside a `Switch.Group` to trigger the `FormControlWrapper` mapping.\n'}}},argTypes:{...j,readOnly:{control:"boolean",description:"Passes read-only lock natively down mapping inner switches into explicitly disabled states."}}},s={args:{formLayout:"stacked",label:"Notification Settings",description:"Manage your preferences.",assistiveText:"We recommend turning these on.",error:"",required:!0},render:function(t){const[r,n]=c.useState(["email"]);return e.jsxs(o,{...t,value:r,onChange:n,children:[e.jsx(a,{value:"email",label:"Email Alerts"}),e.jsx(a,{value:"push",label:"Push Notifications"}),e.jsx(a,{value:"sms",label:"SMS Messages"})]})}},i={args:{...s.args,formLayout:"side-by-side",labelSize:"default",labelAlignment:"left"},render:function(t){const[r,n]=c.useState([]);return e.jsxs(o,{...t,value:r,onChange:n,children:[e.jsx(a,{value:"weekly",label:"Weekly Digest"}),e.jsx(a,{value:"marketing",label:"Marketing Emails"})]})}},l={args:{formLayout:"side-by-side",label:"Enable Backups",description:"Automatically back up your data nightly."},render:function(t){const[r,n]=c.useState(["auto"]);return e.jsx(o,{...t,value:r,onChange:n,children:e.jsx(a,{value:"auto",label:"Auto-backup"})})}},u={args:{...s.args,readOnly:!0,readOnlyComponent:e.jsx("span",{children:"2 Notifications Enabled"})},render:function(t){const[r,n]=c.useState(["email","sms"]);return e.jsxs(o,{...t,value:r,onChange:n,children:[e.jsx(a,{value:"email",label:"Email Alerts"}),e.jsx(a,{value:"push",label:"Push Notifications"}),e.jsx(a,{value:"sms",label:"SMS Messages"})]})}};var m,p,g;s.parameters={...s.parameters,docs:{...(m=s.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    formLayout: "stacked",
    label: "Notification Settings",
    description: "Manage your preferences.",
    assistiveText: "We recommend turning these on.",
    error: "",
    required: true
  },
  render: function DefaultRender(args) {
    const [value, setValue] = useState<string[]>(["email"]);
    return <SwitchGroup {...args} value={value} onChange={setValue}>
        <Switch value="email" label="Email Alerts" />
        <Switch value="push" label="Push Notifications" />
        <Switch value="sms" label="SMS Messages" />
      </SwitchGroup>;
  }
}`,...(g=(p=s.parameters)==null?void 0:p.docs)==null?void 0:g.source}}};var h,y,S;i.parameters={...i.parameters,docs:{...(h=i.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    formLayout: "side-by-side",
    labelSize: "default",
    labelAlignment: "left"
  },
  render: function SideBySideRender(args) {
    const [value, setValue] = useState<string[]>([]);
    return <SwitchGroup {...args} value={value} onChange={setValue}>
        <Switch value="weekly" label="Weekly Digest" />
        <Switch value="marketing" label="Marketing Emails" />
      </SwitchGroup>;
  }
}`,...(S=(y=i.parameters)==null?void 0:y.docs)==null?void 0:S.source}}};var f,b,v;l.parameters={...l.parameters,docs:{...(f=l.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    formLayout: "side-by-side",
    label: "Enable Backups",
    description: "Automatically back up your data nightly."
  },
  render: function SolitaryRender(args) {
    const [value, setValue] = useState<string[]>(["auto"]);
    return <SwitchGroup {...args} value={value} onChange={setValue}>
        <Switch value="auto" label="Auto-backup" />
      </SwitchGroup>;
  }
}`,...(v=(b=l.parameters)==null?void 0:b.docs)==null?void 0:v.source}}};var w,x,k;u.parameters={...u.parameters,docs:{...(w=u.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    readOnly: true,
    readOnlyComponent: <span>2 Notifications Enabled</span>
  },
  render: function ReadOnlyRender(args) {
    const [value, setValue] = useState<string[]>(["email", "sms"]);
    return <SwitchGroup {...args} value={value} onChange={setValue}>
        <Switch value="email" label="Email Alerts" />
        <Switch value="push" label="Push Notifications" />
        <Switch value="sms" label="SMS Messages" />
      </SwitchGroup>;
  }
}`,...(k=(x=u.parameters)==null?void 0:x.docs)==null?void 0:k.source}}};const F=["Default","SideBySideLayout","SolitaryFormControl","GroupReadOnly"];export{s as Default,u as GroupReadOnly,i as SideBySideLayout,l as SolitaryFormControl,F as __namedExportsOrder,z as default};

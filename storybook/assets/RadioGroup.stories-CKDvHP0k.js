import{r as u,j as e}from"./iframe-BHhWYZEC.js";import{a as l,R as a}from"./Radio-9w-i5CkK.js";import{f}from"./commonArgTypes-DcjzA9l3.js";import"./preload-helper-Dp1pzeXC.js";import"./FormControlWrapper-DwDdR9YI.js";import"./get-size-BlbtXTyo.js";import"./factory-CVE1eDgt.js";import"./polymorphic-factory-CnLU5YW3.js";import"./create-optional-context-Bh_A6Tr4.js";import"./UnstyledButton-BRfGAqO1.js";import"./use-id-DcQsRQI5.js";import"./AssistiveElement-DUObxgOi.js";import"./get-auto-contrast-value-Da6zqqWm.js";import"./InputsGroupFieldset-CzHCkDyZ.js";import"./DirectionProvider-IIno09RO.js";import"./use-uncontrolled-D82D5WRd.js";const F={title:"UI-Kit/RadioGroup",component:l,tags:["autodocs"],parameters:{docs:{description:{component:'\nThe `RadioGroup` component is the mandatory organizational wrapper aggregating multiple `Radio` primitives into structurally bound unified selection arrays. It inherently leverages the `FormControlWrapper` granting native access to macroscopic layout structuring, assistive descriptions, and strict flex arrays.\n\nWe exclusively utilize the `formLayout` parameter to control macro-level form flow:\n- **`formLayout="stacked"`**: Top-to-bottom layout cascading the Label bounding box down vertically into a standard stacked radio column array.\n- **`formLayout="side-by-side"`**: Flow architecture pulling the grouping Label dynamically to the left while structurally organizing the internal radios cleanly alongside it horizontally.\n'}}},argTypes:{...f,readOnly:{control:"boolean",description:"Toggles structural read-only data presentation bypassing interaction boundaries completely."}}},n={args:{formLayout:"stacked",required:!0,label:"Hosting Provider",error:"You must select a deployment provider."},render:function(r){const[t,o]=u.useState("aws");return e.jsxs(l,{...r,value:t,onChange:o,children:[e.jsx(a,{value:"aws",label:"Amazon Web Services"}),e.jsx(a,{value:"gcp",label:"Google Cloud Platform (with completely distributed edge computing environments bridging local runtime boundaries seamlessly.)"}),e.jsx(a,{value:"azure",label:"Microsoft Azure"})]})}},s={args:{formLayout:"side-by-side",labelOptionalText:"Recommended",labelWithEditIcon:!0,label:"Deployment Region",assistiveText:"Select the data center closest to your user base."},render:function(r){const[t,o]=u.useState("us-east");return e.jsxs(l,{...r,value:t,onChange:o,children:[e.jsx(a,{value:"us-east",label:"US East (N. Virginia)"}),e.jsx(a,{value:"us-west",label:"US West (Oregon)"}),e.jsx(a,{value:"eu-central",label:"EU Central (Frankfurt)"})]})}},i={args:{readOnly:!0,formLayout:"stacked",required:!0,label:"Selected Framework",assistiveText:"This selection cannot be changed after initialization.",readOnlyComponent:e.jsx("span",{children:"React (Standard Build)"})},render:function(r){const[t,o]=u.useState("react");return e.jsxs(l,{...r,value:t,onChange:o,children:[e.jsx(a,{value:"react",label:"React"}),e.jsx(a,{value:"vue",label:"Vue"})]})}};var c,p,m;n.parameters={...n.parameters,docs:{...(c=n.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    formLayout: "stacked",
    required: true,
    label: "Hosting Provider",
    error: "You must select a deployment provider."
  },
  render: function GroupStackedRender(args) {
    const [value, setValue] = useState<string>("aws");
    return <RadioGroup {...args} value={value} onChange={setValue}>
        <Radio value="aws" label="Amazon Web Services" />
        <Radio value="gcp" label="Google Cloud Platform (with completely distributed edge computing environments bridging local runtime boundaries seamlessly.)" />
        <Radio value="azure" label="Microsoft Azure" />
      </RadioGroup>;
  }
}`,...(m=(p=n.parameters)==null?void 0:p.docs)==null?void 0:m.source}}};var g,y,b;s.parameters={...s.parameters,docs:{...(g=s.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    formLayout: "side-by-side",
    labelOptionalText: "Recommended",
    labelWithEditIcon: true,
    label: "Deployment Region",
    assistiveText: "Select the data center closest to your user base."
  },
  render: function GroupSideBySideRender(args) {
    const [value, setValue] = useState<string>("us-east");
    return <RadioGroup {...args} value={value} onChange={setValue}>
        <Radio value="us-east" label="US East (N. Virginia)" />
        <Radio value="us-west" label="US West (Oregon)" />
        <Radio value="eu-central" label="EU Central (Frankfurt)" />
      </RadioGroup>;
  }
}`,...(b=(y=s.parameters)==null?void 0:y.docs)==null?void 0:b.source}}};var v,R,S;i.parameters={...i.parameters,docs:{...(v=i.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    readOnly: true,
    formLayout: "stacked",
    required: true,
    label: "Selected Framework",
    assistiveText: "This selection cannot be changed after initialization.",
    readOnlyComponent: <span>React (Standard Build)</span>
  },
  render: function StaticReadOnlyGroupRender(args) {
    const [value, setValue] = useState<string>("react");
    return <RadioGroup {...args} value={value} onChange={setValue}>
        <Radio value="react" label="React" />
        <Radio value="vue" label="Vue" />
      </RadioGroup>;
  }
}`,...(S=(R=i.parameters)==null?void 0:R.docs)==null?void 0:S.source}}};const A=["GroupStacked","GroupSideBySide","StaticReadOnlyGroup"];export{s as GroupSideBySide,n as GroupStacked,i as StaticReadOnlyGroup,A as __namedExportsOrder,F as default};

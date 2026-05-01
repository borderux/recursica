import{r as d,j as e}from"./iframe-62VCHLAo.js";import{a as o,R as a}from"./Radio-D2oBTGw4.js";import{f as V}from"./commonArgTypes-DcjzA9l3.js";import"./preload-helper-Dp1pzeXC.js";import"./WithReadOnlyWrapper-DbNbd04c.js";import"./ReadOnlyField-toHu8DIP.js";import"./get-size-qFIEsQoM.js";import"./factory-C1p_Iv34.js";import"./polymorphic-factory-VSsKQd_s.js";import"./create-optional-context-DsWQU-aB.js";import"./use-resolved-styles-api-BLEL5-bE.js";import"./UnstyledButton-B7jmV6FW.js";import"./use-id-D7rW1AES.js";import"./AssistiveElement-BzVXU9Ww.js";import"./get-auto-contrast-value-Da6zqqWm.js";import"./InputsGroupFieldset-YdIG61Se.js";import"./DirectionProvider-CHkWOIVw.js";import"./use-uncontrolled-Dj_rhTi2.js";const N={title:"UI-Kit/RadioGroup",component:o,tags:["autodocs"],parameters:{docs:{description:{component:'\nThe `RadioGroup` component is the mandatory organizational wrapper aggregating multiple `Radio` primitives into structurally bound unified selection arrays. It inherently leverages the `FormControlWrapper` granting native access to macroscopic layout structuring, assistive descriptions, and strict flex arrays.\n\nWe exclusively utilize the `formLayout` parameter to control macro-level form flow:\n- **`formLayout="stacked"`**: Top-to-bottom layout cascading the Label bounding box down vertically into a standard stacked radio column array.\n- **`formLayout="side-by-side"`**: Flow architecture pulling the grouping Label dynamically to the left while structurally organizing the internal radios cleanly alongside it horizontally.\n'}}},argTypes:{...V,readOnly:{control:"boolean",description:"Toggles structural read-only data presentation bypassing interaction boundaries completely."}}},s={args:{formLayout:"stacked",label:"Standard Group"},render:function({withLayer:p,layer:y,...t}){const[r,n]=d.useState("");return e.jsxs(o,{...t,value:r,onChange:n,children:[e.jsx(a,{value:"1",label:"Option 1"}),e.jsx(a,{value:"2",label:"Option 2"})]})}},l={args:{formLayout:"stacked",required:!0,label:"Hosting Provider",error:"You must select a deployment provider."},render:function({withLayer:p,layer:y,...t}){const[r,n]=d.useState("aws");return e.jsxs(o,{...t,value:r,onChange:n,children:[e.jsx(a,{value:"aws",label:"Amazon Web Services"}),e.jsx(a,{value:"gcp",label:"Google Cloud Platform (with completely distributed edge computing environments bridging local runtime boundaries seamlessly.)"}),e.jsx(a,{value:"azure",label:"Microsoft Azure"})]})}},i={args:{formLayout:"side-by-side",labelOptionalText:"Recommended",labelWithEditIcon:!0,label:"Deployment Region",assistiveText:"Select the data center closest to your user base."},render:function({withLayer:p,layer:y,...t}){const[r,n]=d.useState("us-east");return e.jsxs(o,{...t,value:r,onChange:n,children:[e.jsx(a,{value:"us-east",label:"US East (N. Virginia)"}),e.jsx(a,{value:"us-west",label:"US West (Oregon)"}),e.jsx(a,{value:"eu-central",label:"EU Central (Frankfurt)"})]})}},u={args:{readOnly:!0,formLayout:"stacked",required:!0,label:"Selected Framework",assistiveText:"This selection cannot be changed after initialization."},render:function({withLayer:p,layer:y,...t}){const[r,n]=d.useState("react");return e.jsxs(o,{...t,value:r,onChange:n,children:[e.jsx(a,{value:"react",label:"React"}),e.jsx(a,{value:"vue",label:"Vue"})]})}};var m,g,v;s.parameters={...s.parameters,docs:{...(m=s.parameters)==null?void 0:m.docs,source:{originalSource:`{
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
    const [value, setValue] = useState<string>("");
    return <RadioGroup {...args} value={value} onChange={setValue}>
        <Radio value="1" label="Option 1" />
        <Radio value="2" label="Option 2" />
      </RadioGroup>;
  }
}`,...(v=(g=s.parameters)==null?void 0:g.docs)==null?void 0:v.source}}};var b,h,R;l.parameters={...l.parameters,docs:{...(b=l.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    formLayout: "stacked",
    required: true,
    label: "Hosting Provider",
    error: "You must select a deployment provider."
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: function StoryRender({
    withLayer,
    layer,
    ...args
  }: any) {
    const [value, setValue] = useState<string>("aws");
    return <RadioGroup {...args} value={value} onChange={setValue}>
        <Radio value="aws" label="Amazon Web Services" />
        <Radio value="gcp" label="Google Cloud Platform (with completely distributed edge computing environments bridging local runtime boundaries seamlessly.)" />
        <Radio value="azure" label="Microsoft Azure" />
      </RadioGroup>;
  }
}`,...(R=(h=l.parameters)==null?void 0:h.docs)==null?void 0:R.source}}};var f,S,x;i.parameters={...i.parameters,docs:{...(f=i.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    formLayout: "side-by-side",
    labelOptionalText: "Recommended",
    labelWithEditIcon: true,
    label: "Deployment Region",
    assistiveText: "Select the data center closest to your user base."
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: function StoryRender({
    withLayer,
    layer,
    ...args
  }: any) {
    const [value, setValue] = useState<string>("us-east");
    return <RadioGroup {...args} value={value} onChange={setValue}>
        <Radio value="us-east" label="US East (N. Virginia)" />
        <Radio value="us-west" label="US West (Oregon)" />
        <Radio value="eu-central" label="EU Central (Frankfurt)" />
      </RadioGroup>;
  }
}`,...(x=(S=i.parameters)==null?void 0:S.docs)==null?void 0:x.source}}};var L,w,j;u.parameters={...u.parameters,docs:{...(L=u.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    readOnly: true,
    formLayout: "stacked",
    required: true,
    label: "Selected Framework",
    assistiveText: "This selection cannot be changed after initialization."
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: function StoryRender({
    withLayer,
    layer,
    ...args
  }: any) {
    const [value, setValue] = useState<string>("react");
    return <RadioGroup {...args} value={value} onChange={setValue}>
        <Radio value="react" label="React" />
        <Radio value="vue" label="Vue" />
      </RadioGroup>;
  }
}`,...(j=(w=u.parameters)==null?void 0:w.docs)==null?void 0:j.source}}};const Y=["Default","StackedLayout","SideBySideLayout","ReadOnly"];export{s as Default,u as ReadOnly,i as SideBySideLayout,l as StackedLayout,Y as __namedExportsOrder,N as default};

import{r as c,j as e}from"./iframe-DYWv6D9f.js";import{a as s,R as a}from"./Radio-DBZ7fh47.js";import{f as k}from"./commonArgTypes-DcjzA9l3.js";import"./preload-helper-Dp1pzeXC.js";import"./WithReadOnlyWrapper-n4R-vLjb.js";import"./FormControlWrapper-DB8zQIR2.js";import"./AssistiveElement-AR95nA1g.js";import"./useFormControl-C3p9w39B.js";import"./memoTheme-BSkcHbfI.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./isMuiElement-A3-nll8A.js";import"./ReadOnlyField-B4EsahG-.js";import"./useControlled-DgZ6gS4b.js";import"./useForkRef-DwiI9xvK.js";import"./FormGroup-4A0isTH2.js";import"./SwitchBase-CADzAUTd.js";import"./useSlot-B9kPOFCr.js";import"./mergeSlotProps-12Ia89rE.js";import"./isHostComponent-DVu5iVWx.js";import"./ButtonBase-CYmuvHat.js";import"./useTimeout-CBIRdUMa.js";import"./useEventCallback-AL4LP9ud.js";import"./isFocusVisible-B8k4qzLc.js";import"./createSvgIcon-BH5OdSyP.js";import"./createChainedFunction-BO_9K8Jh.js";const ae={title:"UI-Kit/RadioGroup",component:s,tags:["autodocs"],parameters:{docs:{description:{component:'\nThe `RadioGroup` component is the mandatory organizational wrapper aggregating multiple `Radio` primitives into structurally bound unified selection arrays. It inherently leverages the `FormControlWrapper` granting native access to macroscopic layout structuring, assistive descriptions, and strict flex arrays.\n\nWe exclusively utilize the `formLayout` parameter to control macro-level form flow:\n- **`formLayout="stacked"`**: Top-to-bottom layout cascading the Label bounding box down vertically into a standard stacked radio column array.\n- **`formLayout="side-by-side"`**: Flow architecture pulling the grouping Label dynamically to the left while structurally organizing the internal radios cleanly alongside it horizontally.\n'}}},argTypes:{...k,readOnly:{control:"boolean",description:"Toggles structural read-only data presentation bypassing interaction boundaries completely."}}},l={args:{formLayout:"stacked",label:"Standard Group"},render:function({withLayer:m,layer:y,...t}){const[r,n]=c.useState("");return e.jsxs(s,{...t,value:r,onChange:(g,o)=>n(o),children:[e.jsx(a,{value:"1",label:"Option 1"}),e.jsx(a,{value:"2",label:"Option 2"})]})}},i={args:{formLayout:"stacked",required:!0,label:"Hosting Provider",error:"You must select a deployment provider."},render:function({withLayer:m,layer:y,...t}){const[r,n]=c.useState("aws");return e.jsxs(s,{...t,value:r,onChange:(g,o)=>n(o),children:[e.jsx(a,{value:"aws",label:"Amazon Web Services"}),e.jsx(a,{value:"gcp",label:"Google Cloud Platform (with completely distributed edge computing environments bridging local runtime boundaries seamlessly.)"}),e.jsx(a,{value:"azure",label:"Microsoft Azure"})]})}},u={args:{formLayout:"side-by-side",labelOptionalText:"Recommended",labelWithEditIcon:!0,label:"Deployment Region",assistiveText:"Select the data center closest to your user base."},render:function({withLayer:m,layer:y,...t}){const[r,n]=c.useState("us-east");return e.jsxs(s,{...t,value:r,onChange:(g,o)=>n(o),children:[e.jsx(a,{value:"us-east",label:"US East (N. Virginia)"}),e.jsx(a,{value:"us-west",label:"US West (Oregon)"}),e.jsx(a,{value:"eu-central",label:"EU Central (Frankfurt)"})]})}},d={args:{readOnly:!0,formLayout:"stacked",required:!0,label:"Selected Framework",assistiveText:"This selection cannot be changed after initialization."},render:function({withLayer:m,layer:y,...t}){const[r,n]=c.useState("react");return e.jsxs(s,{...t,value:r,onChange:(g,o)=>n(o),children:[e.jsx(a,{value:"react",label:"React"}),e.jsx(a,{value:"vue",label:"Vue"})]})}};var v,b,h;l.parameters={...l.parameters,docs:{...(v=l.parameters)==null?void 0:v.docs,source:{originalSource:`{
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
    return <RadioGroup {...args} value={value} onChange={(_e, val) => setValue(val)}>
        <Radio value="1" label="Option 1" />
        <Radio value="2" label="Option 2" />
      </RadioGroup>;
  }
}`,...(h=(b=l.parameters)==null?void 0:b.docs)==null?void 0:h.source}}};var R,f,S;i.parameters={...i.parameters,docs:{...(R=i.parameters)==null?void 0:R.docs,source:{originalSource:`{
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
    return <RadioGroup {...args} value={value} onChange={(_e, val) => setValue(val)}>
        <Radio value="aws" label="Amazon Web Services" />
        <Radio value="gcp" label="Google Cloud Platform (with completely distributed edge computing environments bridging local runtime boundaries seamlessly.)" />
        <Radio value="azure" label="Microsoft Azure" />
      </RadioGroup>;
  }
}`,...(S=(f=i.parameters)==null?void 0:f.docs)==null?void 0:S.source}}};var x,L,w;u.parameters={...u.parameters,docs:{...(x=u.parameters)==null?void 0:x.docs,source:{originalSource:`{
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
    return <RadioGroup {...args} value={value} onChange={(_e, val) => setValue(val)}>
        <Radio value="us-east" label="US East (N. Virginia)" />
        <Radio value="us-west" label="US West (Oregon)" />
        <Radio value="eu-central" label="EU Central (Frankfurt)" />
      </RadioGroup>;
  }
}`,...(w=(L=u.parameters)==null?void 0:L.docs)==null?void 0:w.source}}};var j,V,G;d.parameters={...d.parameters,docs:{...(j=d.parameters)==null?void 0:j.docs,source:{originalSource:`{
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
    return <RadioGroup {...args} value={value} onChange={(_e, val) => setValue(val)}>
        <Radio value="react" label="React" />
        <Radio value="vue" label="Vue" />
      </RadioGroup>;
  }
}`,...(G=(V=d.parameters)==null?void 0:V.docs)==null?void 0:G.source}}};const te=["Default","StackedLayout","SideBySideLayout","ReadOnly"];export{l as Default,d as ReadOnly,u as SideBySideLayout,i as StackedLayout,te as __namedExportsOrder,ae as default};

import{r as u,j as e}from"./iframe-Cfrmv-sD.js";import{a as S,C as t}from"./Checkbox-DG0Ln3f8.js";import{f as G}from"./commonArgTypes-DcjzA9l3.js";import"./preload-helper-Dp1pzeXC.js";import"./FormControlWrapper-XFze9NYg.js";import"./get-size-0ZAaIumh.js";import"./factory-B3pmeTAA.js";import"./polymorphic-factory-F4O7v52k.js";import"./create-optional-context-DKB1ywIg.js";import"./UnstyledButton-dfWf7gTY.js";import"./use-id-DgIgn6iy.js";import"./AssistiveElement-X6WZVyQ_.js";import"./use-uncontrolled-BHqT_4Oo.js";import"./CheckIcon-DQXrH9gO.js";const F={title:"UI-Kit/CheckboxGroup",component:S,tags:["autodocs"],parameters:{docs:{description:{component:'\nThe `CheckboxGroup` component is the mandatory organizational wrapper aggregating multiple `Checkbox` primitives into structurally bound unified arrays. It inherently leverages the `FormControlWrapper` granting native access to macroscopic layout structuring, assistive descriptions, and strict flex arrays.\n\nWe exclusively utilize the `formLayout` parameter to control macro-level form flow:\n- **`formLayout="stacked"`**: Top-to-bottom layout cascading the Label bounding box down vertically into a standard stacked checkbox column array.\n- **`formLayout="side-by-side"`**: Flow architecture pulling the grouping Label dynamically to the left while structurally organizing the internal checkboxes cleanly alongside it horizontally.\n\n```tsx\n<Checkbox.Group \n  label="Execution Targets" \n  assistiveText="Strictly mapped structural grouping dynamically applied natively."\n  formLayout="stacked" \n>\n  <Checkbox value="react" label="Browser Execution Context" />\n  <Checkbox value="svelte" label="Edge Nodes" />\n</Checkbox.Group>\n```\n'}}},argTypes:{...G,readOnly:{control:"boolean",description:"Toggles structural read-only data presentation bypassing interaction boundaries completely."}}},n={args:{formLayout:"side-by-side",labelOptionalText:"Recommended",labelWithEditIcon:!0,label:"Frontend Frameworks",assistiveText:"Select all libraries currently in use for this specific workspace configuration."},render:function(a){const[r,o]=u.useState(["react"]);return e.jsxs(t.Group,{...a,value:r,onChange:o,children:[e.jsx(t,{value:"react",label:"React (Standard Build)"}),e.jsx(t,{value:"svelte",label:"The Svelte architecture which provides a highly optimized, completely compiler-driven framework avoiding virtual DOM boundaries. This massively extended text explicitly guarantees accurate wrapper constraint checking and multi-line flex alignment."}),e.jsx(t,{value:"vue",label:"Vue Configuration Map"})]})}},l={args:{formLayout:"stacked",required:!0,label:"Execution Targets",error:"You must select at least one deployment target to compile."},render:function(a){const[r,o]=u.useState(["react"]);return e.jsxs(t.Group,{...a,value:r,onChange:o,children:[e.jsx(t,{value:"react",label:"Browser Execution Context"}),e.jsx(t,{value:"svelte",label:"Highly distributed Edge computing environments seamlessly bridging local runtime boundaries."}),e.jsx(t,{value:"vue",label:"Serverless Cloud Providers"})]})}},i={args:{readOnly:!0,formLayout:"stacked",required:!0,label:"Static ReadOnly Execution Locks",assistiveText:"This structure explicitly validates native component-level DOM preservation natively mapping lock bounds safely over interaction."},render:function(a){const[r,o]=u.useState(["disabledNode"]);return e.jsxs(t.Group,{...a,value:r,onChange:o,children:[e.jsx(t,{value:"disabledNode",label:"Structurally Checked Node natively"}),e.jsx(t,{value:"disabledNodeEmpty",label:"Unchecked Configuration Limit"})]})}},s={args:{readOnly:!0,formLayout:"side-by-side",labelWithEditIcon:!0,label:"Interactively Editable ReadOnly Group",assistiveText:"Users explicitly unlock DOM structures dynamically."},render:function(a){const[r,o]=u.useState(["activeState"]);return e.jsxs(t.Group,{...a,value:r,onChange:o,children:[e.jsx(t,{value:"activeState",label:"Locked active state"}),e.jsx(t,{value:"unlockedNode",label:"Locked inactive map"})]})}};var d,p,m;n.parameters={...n.parameters,docs:{...(d=n.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    formLayout: "side-by-side",
    labelOptionalText: "Recommended",
    labelWithEditIcon: true,
    label: "Frontend Frameworks",
    assistiveText: "Select all libraries currently in use for this specific workspace configuration."
  },
  render: function GroupSideBySideRender(args) {
    const [value, setValue] = useState<string[]>(["react"]);
    return <Checkbox.Group {...args} value={value} onChange={setValue}>
        <Checkbox value="react" label="React (Standard Build)" />
        <Checkbox value="svelte" label="The Svelte architecture which provides a highly optimized, completely compiler-driven framework avoiding virtual DOM boundaries. This massively extended text explicitly guarantees accurate wrapper constraint checking and multi-line flex alignment." />
        <Checkbox value="vue" label="Vue Configuration Map" />
      </Checkbox.Group>;
  }
}`,...(m=(p=n.parameters)==null?void 0:p.docs)==null?void 0:m.source}}};var b,v,y;l.parameters={...l.parameters,docs:{...(b=l.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    formLayout: "stacked",
    required: true,
    label: "Execution Targets",
    error: "You must select at least one deployment target to compile."
  },
  render: function GroupStackedRender(args) {
    const [value, setValue] = useState<string[]>(["react"]);
    return <Checkbox.Group {...args} value={value} onChange={setValue}>
        <Checkbox value="react" label="Browser Execution Context" />
        <Checkbox value="svelte" label="Highly distributed Edge computing environments seamlessly bridging local runtime boundaries." />
        <Checkbox value="vue" label="Serverless Cloud Providers" />
      </Checkbox.Group>;
  }
}`,...(y=(v=l.parameters)==null?void 0:v.docs)==null?void 0:y.source}}};var g,x,h;i.parameters={...i.parameters,docs:{...(g=i.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    readOnly: true,
    formLayout: "stacked",
    required: true,
    label: "Static ReadOnly Execution Locks",
    assistiveText: "This structure explicitly validates native component-level DOM preservation natively mapping lock bounds safely over interaction."
  },
  render: function StaticReadOnlyGroupRender(args) {
    const [value, setValue] = useState<string[]>(["disabledNode"]);
    return <Checkbox.Group {...args} value={value} onChange={setValue}>
        <Checkbox value="disabledNode" label="Structurally Checked Node natively" />
        <Checkbox value="disabledNodeEmpty" label="Unchecked Configuration Limit" />
      </Checkbox.Group>;
  }
}`,...(h=(x=i.parameters)==null?void 0:x.docs)==null?void 0:h.source}}};var k,C,f;s.parameters={...s.parameters,docs:{...(k=s.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    readOnly: true,
    formLayout: "side-by-side",
    labelWithEditIcon: true,
    label: "Interactively Editable ReadOnly Group",
    assistiveText: "Users explicitly unlock DOM structures dynamically."
  },
  render: function EditableReadOnlyGroupRender(args) {
    const [value, setValue] = useState<string[]>(["activeState"]);
    return <Checkbox.Group {...args} value={value} onChange={setValue}>
        <Checkbox value="activeState" label="Locked active state" />
        <Checkbox value="unlockedNode" label="Locked inactive map" />
      </Checkbox.Group>;
  }
}`,...(f=(C=s.parameters)==null?void 0:C.docs)==null?void 0:f.source}}};const W=["GroupSideBySide","GroupStacked","StaticReadOnlyGroup","EditableReadOnlyGroup"];export{s as EditableReadOnlyGroup,n as GroupSideBySide,l as GroupStacked,i as StaticReadOnlyGroup,W as __namedExportsOrder,F as default};

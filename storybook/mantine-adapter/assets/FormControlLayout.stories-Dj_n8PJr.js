import{j as a}from"./iframe-kleCLvyU.js";import{F as w}from"./FormControlWrapper-bcZ_v1j9.js";import{S as i}from"./Switch-CvDvIspB.js";import"./preload-helper-Dp1pzeXC.js";import"./get-size-D1xvcvcL.js";import"./factory-SJRKBzbr.js";import"./polymorphic-factory-BIatzRDB.js";import"./create-optional-context-B6vzNrwk.js";import"./use-resolved-styles-api-BqM1QCmQ.js";import"./CloseButton-B9-YsQWF.js";import"./UnstyledButton-lWoC7Bjb.js";import"./use-id-CFfH4I3G.js";import"./AssistiveElement-DTMM763c.js";import"./WithReadOnlyWrapper-CPI4Dr-S.js";import"./ReadOnlyField-CgEtoKb8.js";import"./InputsGroupFieldset-9rBAPEZx.js";import"./use-uncontrolled-8yj8lwKw.js";import"./CheckIcon-DNE1jt0s.js";const K={title:"UI-Kit/FormControlLayout",component:w,parameters:{layout:"padded",docs:{description:{component:"A layout component used to correctly position form inputs alongside their labels.\n\n**When to use this:**\nTypically, you should use `FormControlWrapper` instead, which uses this component under the hood to handle layout automatically.\n\nHowever, this component is useful when you need to align standalone inputs (like a `Switch` or `Checkbox` without a label) so they perfectly match the spacing and alignment of your other form fields in a `side-by-side` layout."}}},tags:["autodocs"],argTypes:{formLayout:{control:"radio",options:["stacked","side-by-side"]},labelSize:{control:"radio",options:["default","small","md"],description:"Dictates the physical width of the left column."},children:{table:{disable:!0}},leftSection:{table:{disable:!0}}}},e={args:{formLayout:"stacked",labelSize:"default",leftSection:a.jsx("div",{style:{padding:8,border:"1px dashed #ccc",background:"#fafafa"},children:"Left Section Boundary"}),children:a.jsx(i,{label:"Input area content"})}},t={args:{formLayout:"stacked",labelSize:"default",children:a.jsx(i,{label:"Flush stacked switch"})}},o={args:{formLayout:"side-by-side",labelSize:"default",children:a.jsx(i,{label:"Offset switch aligning with grid"})}};var r,n,s,l,d;e.parameters={...e.parameters,docs:{...(r=e.parameters)==null?void 0:r.docs,source:{originalSource:`{
  args: {
    formLayout: "stacked",
    labelSize: "default",
    leftSection: <div style={{
      padding: 8,
      border: "1px dashed #ccc",
      background: "#fafafa"
    }}>
        Left Section Boundary
      </div>,
    children: <Switch label="Input area content" />
  }
}`,...(s=(n=e.parameters)==null?void 0:n.docs)==null?void 0:s.source},description:{story:`The Default layout demonstrates wrapping a standalone primitive without a Label.
In a stacked layout, an omitted leftSection naturally results in no structural padding.`,...(d=(l=e.parameters)==null?void 0:l.docs)==null?void 0:d.description}}};var c,u,p,m,h;t.parameters={...t.parameters,docs:{...(c=t.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    formLayout: "stacked",
    labelSize: "default",
    children: <Switch label="Flush stacked switch" />
  }
}`,...(p=(u=t.parameters)==null?void 0:u.docs)==null?void 0:p.source},description:{story:`Demonstrates the stacked layout without a left section.
The input should natively pull flush to the top left since there is no left column.`,...(h=(m=t.parameters)==null?void 0:m.docs)==null?void 0:h.description}}};var f,y,b,g,S;o.parameters={...o.parameters,docs:{...(f=o.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    formLayout: "side-by-side",
    labelSize: "default",
    children: <Switch label="Offset switch aligning with grid" />
  }
}`,...(b=(y=o.parameters)==null?void 0:y.docs)==null?void 0:b.source},description:{story:"Demonstrates how a naked boolean primitive perfectly aligns in a side-by-side layout\nby utilizing the layout wrapper. The left column maintains its precise design system width\neven when `leftSection` is undefined, forcing the component into the correct form column!",...(S=(g=o.parameters)==null?void 0:g.docs)==null?void 0:S.description}}};const R=["Default","StackedLayout","SideBySideLayout"];export{e as Default,o as SideBySideLayout,t as StackedLayout,R as __namedExportsOrder,K as default};

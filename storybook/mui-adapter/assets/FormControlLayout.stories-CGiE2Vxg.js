import{j as e}from"./iframe-C_ymJL69.js";import{F as n}from"./FormControlLayout-CxLXgHi1.js";import{S as i}from"./Switch-f6oFvU3K.js";import"./preload-helper-Dp1pzeXC.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./SwitchBase-WUITTLJy.js";import"./styled-CVDphjR5.js";import"./useFormControl-CCBjUjcD.js";import"./generateUtilityClass-BtcU_pBl.js";import"./generateUtilityClasses-DDbjFgb8.js";import"./useSlot-da_fafqN.js";import"./mergeSlotProps-NJnF42jJ.js";import"./isHostComponent-DVu5iVWx.js";import"./useForkRef-BlrSiLQa.js";import"./useControlled-XnJ3kiQa.js";import"./ButtonBase-BMpcVYGR.js";import"./useTimeout-0m_RpfT3.js";import"./useEventCallback-guZE-voT.js";import"./isFocusVisible-B8k4qzLc.js";import"./memoTheme-DuK-uO2q.js";import"./mergeSlotProps-DbhufgKY.js";const G={title:"UI-Kit/FormControlLayout",component:n,parameters:{layout:"padded",docs:{description:{component:"A layout component used to correctly position form inputs alongside their labels.\n\n**When to use this:**\nTypically, you should use `FormControlWrapper` instead, which uses this component under the hood to handle layout automatically.\n\nHowever, this component is useful when you need to align standalone inputs (like a `Switch` or `Checkbox` without a label) so they perfectly match the spacing and alignment of your other form fields in a `side-by-side` layout."}},controls:{include:["formLayout","labelSize"]}},tags:["autodocs"],argTypes:{formLayout:{control:"radio",options:["stacked","side-by-side"]},labelSize:{control:"radio",options:["default","small","md"],description:"Dictates the physical width of the left column."},children:{table:{disable:!0}},leftSection:{table:{disable:!0}}}},o={args:{formLayout:"stacked",labelSize:"default",leftSection:e.jsx("div",{style:{padding:8,border:"1px dashed #ccc",background:"#fafafa"},children:"Left Section Boundary"}),children:e.jsx(i,{label:"Input area content"})},render:({...t})=>e.jsx(n,{...t})},a={args:{formLayout:"stacked",labelSize:"default",children:e.jsx(i,{label:"Flush stacked switch"})},render:({...t})=>e.jsx(n,{...t})},r={args:{formLayout:"side-by-side",labelSize:"default",children:e.jsx(i,{label:"Offset switch aligning with grid"})},render:({...t})=>e.jsx(n,{...t})};var s,l,d,c,u;o.parameters={...o.parameters,docs:{...(s=o.parameters)==null?void 0:s.docs,source:{originalSource:`{
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
  },
  render: ({
    ...args
  }: any) => <FormControlLayout {...args} />
}`,...(d=(l=o.parameters)==null?void 0:l.docs)==null?void 0:d.source},description:{story:`The Default layout demonstrates wrapping a standalone primitive without a Label.
In a stacked layout, an omitted leftSection naturally results in no structural padding.`,...(u=(c=o.parameters)==null?void 0:c.docs)==null?void 0:u.description}}};var p,m,h,y,f;a.parameters={...a.parameters,docs:{...(p=a.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    formLayout: "stacked",
    labelSize: "default",
    children: <Switch label="Flush stacked switch" />
  },
  render: ({
    ...args
  }: any) => <FormControlLayout {...args} />
}`,...(h=(m=a.parameters)==null?void 0:m.docs)==null?void 0:h.source},description:{story:`Demonstrates the stacked layout without a left section.
The input should natively pull flush to the top left since there is no left column.`,...(f=(y=a.parameters)==null?void 0:y.docs)==null?void 0:f.description}}};var g,b,S,w,L;r.parameters={...r.parameters,docs:{...(g=r.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    formLayout: "side-by-side",
    labelSize: "default",
    children: <Switch label="Offset switch aligning with grid" />
  },
  render: ({
    ...args
  }: any) => <FormControlLayout {...args} />
}`,...(S=(b=r.parameters)==null?void 0:b.docs)==null?void 0:S.source},description:{story:"Demonstrates how a naked boolean primitive perfectly aligns in a side-by-side layout\nby utilizing the layout wrapper. The left column maintains its precise design system width\neven when `leftSection` is undefined, forcing the component into the correct form column!",...(L=(w=r.parameters)==null?void 0:w.docs)==null?void 0:L.description}}};const J=["Default","StackedLayout","SideBySideLayout"];export{o as Default,r as SideBySideLayout,a as StackedLayout,J as __namedExportsOrder,G as default};

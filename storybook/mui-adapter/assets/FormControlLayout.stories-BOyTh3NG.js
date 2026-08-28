import{j as a}from"./iframe-DwzbXXsg.js";import{F as w}from"./FormControlWrapper-D8wrHspI.js";import{S as i}from"./Switch-irbewpsn.js";import"./preload-helper-Dp1pzeXC.js";import"./AssistiveElement-Da1ftJCs.js";import"./useFormControl-CMoRXqtB.js";import"./memoTheme-VNhdAq_e.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./isMuiElement-C5tXw-kS.js";import"./WithReadOnlyWrapper-piwUruTl.js";import"./ReadOnlyField-BtKcfNVE.js";import"./FormGroup-BGjQoaJ2.js";import"./SwitchBase-8UXz2DXe.js";import"./useSlot-D3WXn4hk.js";import"./mergeSlotProps-ESQ19004.js";import"./isHostComponent-DVu5iVWx.js";import"./useForkRef-DIGfaA-o.js";import"./useControlled-XPFNiyC5.js";import"./ButtonBase-DrWn9hz0.js";import"./useTimeout-0OGhdP7n.js";import"./useEventCallback-C68EW9dQ.js";import"./isFocusVisible-B8k4qzLc.js";import"./mergeSlotProps-tGTBTp1L.js";const M={title:"UI-Kit/FormControlLayout",component:w,parameters:{layout:"padded",docs:{description:{component:"A layout component used to correctly position form inputs alongside their labels.\n\n**When to use this:**\nTypically, you should use `FormControlWrapper` instead, which uses this component under the hood to handle layout automatically.\n\nHowever, this component is useful when you need to align standalone inputs (like a `Switch` or `Checkbox` without a label) so they perfectly match the spacing and alignment of your other form fields in a `side-by-side` layout."}}},tags:["autodocs"],argTypes:{formLayout:{control:"radio",options:["stacked","side-by-side"]},labelSize:{control:"radio",options:["default","small","md"],description:"Dictates the physical width of the left column."},children:{table:{disable:!0}},leftSection:{table:{disable:!0}}}},e={args:{formLayout:"stacked",labelSize:"default",leftSection:a.jsx("div",{style:{padding:8,border:"1px dashed #ccc",background:"#fafafa"},children:"Left Section Boundary"}),children:a.jsx(i,{label:"Input area content"})}},t={args:{formLayout:"stacked",labelSize:"default",children:a.jsx(i,{label:"Flush stacked switch"})}},o={args:{formLayout:"side-by-side",labelSize:"default",children:a.jsx(i,{label:"Offset switch aligning with grid"})}};var r,n,s,l,d;e.parameters={...e.parameters,docs:{...(r=e.parameters)==null?void 0:r.docs,source:{originalSource:`{
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
In a stacked layout, an omitted leftSection naturally results in no structural padding.`,...(d=(l=e.parameters)==null?void 0:l.docs)==null?void 0:d.description}}};var c,p,u,m,h;t.parameters={...t.parameters,docs:{...(c=t.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    formLayout: "stacked",
    labelSize: "default",
    children: <Switch label="Flush stacked switch" />
  }
}`,...(u=(p=t.parameters)==null?void 0:p.docs)==null?void 0:u.source},description:{story:`Demonstrates the stacked layout without a left section.
The input should natively pull flush to the top left since there is no left column.`,...(h=(m=t.parameters)==null?void 0:m.docs)==null?void 0:h.description}}};var f,y,b,g,S;o.parameters={...o.parameters,docs:{...(f=o.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    formLayout: "side-by-side",
    labelSize: "default",
    children: <Switch label="Offset switch aligning with grid" />
  }
}`,...(b=(y=o.parameters)==null?void 0:y.docs)==null?void 0:b.source},description:{story:"Demonstrates how a naked boolean primitive perfectly aligns in a side-by-side layout\nby utilizing the layout wrapper. The left column maintains its precise design system width\neven when `leftSection` is undefined, forcing the component into the correct form column!",...(S=(g=o.parameters)==null?void 0:g.docs)==null?void 0:S.description}}};const N=["Default","StackedLayout","SideBySideLayout"];export{e as Default,o as SideBySideLayout,t as StackedLayout,N as __namedExportsOrder,M as default};

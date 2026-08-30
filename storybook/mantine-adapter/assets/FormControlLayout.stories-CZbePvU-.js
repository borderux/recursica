import{j as e}from"./iframe-DR-INLC0.js";import{F as B}from"./FormControlWrapper-Ihrqi2ZL.js";import{S as l}from"./Switch-4aWN7BoJ.js";import{L as T}from"./Label-VNEleq_e.js";import"./preload-helper-Dp1pzeXC.js";import"./AssistiveElement-BllSNf-H.js";import"./WithReadOnlyWrapper-3lMlh9PQ.js";import"./ReadOnlyField-CUffDlui.js";import"./factory-DITFcJHQ.js";import"./get-size-D0EXS9U1.js";import"./InputsGroupFieldset-RTixcu9J.js";import"./use-uncontrolled-qN_0vGE3.js";import"./use-id-7hhaRI77.js";import"./CheckIcon-CPYX7hl8.js";import"./CloseButton-OgdhdTEi.js";import"./polymorphic-factory-C7BhgFU3.js";import"./UnstyledButton-efBzRtQX.js";import"./create-optional-context-CYjrubmi.js";import"./use-resolved-styles-api-BQwmyGG0.js";const $={title:"UI-Kit/FormControlLayout",component:B,parameters:{layout:"padded",docs:{description:{component:"A layout component used to correctly position form inputs alongside their labels.\n\n**When to use this:**\nTypically, you should use `FormControlWrapper` instead, which uses this component under the hood to handle layout automatically.\n\nHowever, this component is useful when you need to align standalone inputs (like a `Switch` or `Checkbox` without a label) so they perfectly match the spacing and alignment of your other form fields in a `side-by-side` layout."}}},tags:["autodocs"],argTypes:{formLayout:{control:"radio",options:["stacked","side-by-side"]},labelSize:{control:"radio",options:["default","small","md"],description:"Dictates the physical width of the left column."},children:{table:{disable:!0}},leftSection:{table:{disable:!0}}}},t={args:{formLayout:"stacked",labelSize:"default",leftSection:e.jsx("div",{style:{padding:8,border:"1px dashed #ccc",background:"#fafafa"},children:"Left Section Boundary"}),children:e.jsx(l,{label:"Input area content"})}},a={args:{formLayout:"stacked",labelSize:"default",children:e.jsx(l,{label:"Flush stacked switch"})}},o={args:{formLayout:"side-by-side",labelSize:"default",children:e.jsx(l,{label:"Offset switch aligning with grid"})}},n={args:{formLayout:"stacked",labelSize:"default",leftSection:e.jsx(T,{labelSize:"default",children:"A fairly long label to show the stacked-layout width cap in action"}),children:e.jsx(l,{label:"Input area content"})}},i={args:{formLayout:"stacked",labelSize:"small",leftSection:e.jsx(T,{labelSize:"small",children:"A fairly long label to show the stacked-layout width cap in action"}),children:e.jsx(l,{label:"Input area content"})}};var r,s,c,d,u;t.parameters={...t.parameters,docs:{...(r=t.parameters)==null?void 0:r.docs,source:{originalSource:`{
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
}`,...(c=(s=t.parameters)==null?void 0:s.docs)==null?void 0:c.source},description:{story:`The Default layout demonstrates wrapping a standalone primitive without a Label.
In a stacked layout, an omitted leftSection naturally results in no structural padding.`,...(u=(d=t.parameters)==null?void 0:d.docs)==null?void 0:u.description}}};var p,m,h,f,y;a.parameters={...a.parameters,docs:{...(p=a.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    formLayout: "stacked",
    labelSize: "default",
    children: <Switch label="Flush stacked switch" />
  }
}`,...(h=(m=a.parameters)==null?void 0:m.docs)==null?void 0:h.source},description:{story:`Demonstrates the stacked layout without a left section.
The input should natively pull flush to the top left since there is no left column.`,...(y=(f=a.parameters)==null?void 0:f.docs)==null?void 0:y.description}}};var b,S,g,w,L;o.parameters={...o.parameters,docs:{...(b=o.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    formLayout: "side-by-side",
    labelSize: "default",
    children: <Switch label="Offset switch aligning with grid" />
  }
}`,...(g=(S=o.parameters)==null?void 0:S.docs)==null?void 0:g.source},description:{story:"Demonstrates how a naked boolean primitive perfectly aligns in a side-by-side layout\nby utilizing the layout wrapper. The left column maintains its precise design system width\neven when `leftSection` is undefined, forcing the component into the correct form column!",...(L=(w=o.parameters)==null?void 0:w.docs)==null?void 0:L.description}}};var k,x,z,v,j;n.parameters={...n.parameters,docs:{...(k=n.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    formLayout: "stacked",
    labelSize: "default",
    leftSection: <Label labelSize="default">
        A fairly long label to show the stacked-layout width cap in action
      </Label>,
    children: <Switch label="Input area content" />
  }
}`,...(z=(x=n.parameters)==null?void 0:x.docs)==null?void 0:z.source},description:{story:`A real Label (not a placeholder) in a stacked layout, at \`labelSize="default"\`. Even
though the label sits above the field rather than beside it, its own column still caps
to the design system's stacked-layout width (224px) rather than stretching to the full
container — long label text wraps instead of spanning edge-to-edge.`,...(j=(v=n.parameters)==null?void 0:v.docs)==null?void 0:j.description}}};var D,I,A,F,W;i.parameters={...i.parameters,docs:{...(D=i.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    formLayout: "stacked",
    labelSize: "small",
    leftSection: <Label labelSize="small">
        A fairly long label to show the stacked-layout width cap in action
      </Label>,
    children: <Switch label="Input area content" />
  }
}`,...(A=(I=i.parameters)==null?void 0:I.docs)==null?void 0:A.source},description:{story:'Same as above, at `labelSize="small"` — the stacked-layout width cap is narrower (80px).',...(W=(F=i.parameters)==null?void 0:F.docs)==null?void 0:W.description}}};const ee=["Default","StackedLayout","SideBySideLayout","StackedLayoutWithLabelDefault","StackedLayoutWithLabelSmall"];export{t as Default,o as SideBySideLayout,a as StackedLayout,n as StackedLayoutWithLabelDefault,i as StackedLayoutWithLabelSmall,ee as __namedExportsOrder,$ as default};

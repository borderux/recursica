import{j as M}from"./iframe-d8_mgu_F.js";import{L as j}from"./FormControlWrapper-CXOqPfDC.js";import{T as P}from"./TextField-6F_0E9iS.js";import{f as U}from"./commonArgTypes-DcjzA9l3.js";import"./preload-helper-Dp1pzeXC.js";import"./get-size-J7CBMG80.js";import"./factory-BnxMGGpV.js";import"./polymorphic-factory-D_h49hYh.js";import"./create-optional-context-CksL04J4.js";import"./UnstyledButton-BAqRjZ2G.js";import"./use-id-D4iUNtas.js";import"./AssistiveElement-Cio2Zk0-.js";import"./WithReadOnlyWrapper-DoWMAjiZ.js";import"./ReadOnlyField-q6SmYV1m.js";const ae={title:"UI-Kit/Label",component:j,tags:["autodocs"],parameters:{docs:{description:{component:"The `Label` component is a strict Recursica-styled wrapper around Mantine's native `Input.Label`. It serves as the primary compositional primitive for all form fields, preserving Mantine's accessibility associations and context while strictly enforcing the Recursica atomic design system.\n\n### Usage with Form Inputs\nWhen working with form structures, render this `Label` component directly above your inputs or supply it to a component's overriding properties. The component automatically maps structural layout dimensions, dynamic alignment (`left` vs `right`), custom indicator gaps, and integrates a customized `optionalText` and `withEditIcon` flow that safely bypasses Mantine's native required asterisk mechanisms."}}},argTypes:{...U}},e=({children:N,...z})=>M.jsx(P,{label:N,placeholder:"Form Control primitive mapped...",...z}),r={args:{children:"Dynamic Label (Controls)",formLayout:"stacked",labelSize:"default",labelAlignment:"left",required:!1,labelOptionalText:"",labelWithEditIcon:!1},render:e},t={args:{children:"Email Address",formLayout:"stacked"},render:e},a={args:{children:"Primary Network Node",formLayout:"stacked",required:!0},render:e},n={args:{children:"Environment Variables",formLayout:"stacked",labelWithEditIcon:!0},render:e},i={args:{children:"Status",formLayout:"side-by-side",labelSize:"default"},render:e},s={args:{children:"Full Name",formLayout:"stacked",required:!0,labelOptionalText:"This should not render"},render:e},o={args:{children:"Middle Initial",formLayout:"side-by-side",labelOptionalText:!0},render:e},d={args:{children:"Shipping Address",formLayout:"side-by-side",labelWithEditIcon:!0},render:e},l={args:{children:"Configuration",formLayout:"side-by-side",labelWithEditIcon:!0},render:e};var c,m,u;r.parameters={...r.parameters,docs:{...(c=r.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    children: "Dynamic Label (Controls)",
    formLayout: "stacked",
    labelSize: "default",
    labelAlignment: "left",
    required: false,
    labelOptionalText: "",
    labelWithEditIcon: false
  },
  render: renderWithTextField
}`,...(u=(m=r.parameters)==null?void 0:m.docs)==null?void 0:u.source}}};var p,h,f;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    children: "Email Address",
    formLayout: "stacked"
  },
  render: renderWithTextField
}`,...(f=(h=t.parameters)==null?void 0:h.docs)==null?void 0:f.source}}};var y,g,b;a.parameters={...a.parameters,docs:{...(y=a.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    children: "Primary Network Node",
    formLayout: "stacked",
    required: true
  },
  render: renderWithTextField
}`,...(b=(g=a.parameters)==null?void 0:g.docs)==null?void 0:b.source}}};var S,T,x;n.parameters={...n.parameters,docs:{...(S=n.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    children: "Environment Variables",
    formLayout: "stacked",
    labelWithEditIcon: true
  },
  render: renderWithTextField
}`,...(x=(T=n.parameters)==null?void 0:T.docs)==null?void 0:x.source}}};var L,W,k;i.parameters={...i.parameters,docs:{...(L=i.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    children: "Status",
    formLayout: "side-by-side",
    labelSize: "default"
  },
  render: renderWithTextField
}`,...(k=(W=i.parameters)==null?void 0:W.docs)==null?void 0:k.source}}};var E,I,F;s.parameters={...s.parameters,docs:{...(E=s.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    children: "Full Name",
    formLayout: "stacked",
    required: true,
    labelOptionalText: "This should not render"
  },
  render: renderWithTextField
}`,...(F=(I=s.parameters)==null?void 0:I.docs)==null?void 0:F.source}}};var O,q,v;o.parameters={...o.parameters,docs:{...(O=o.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    children: "Middle Initial",
    formLayout: "side-by-side",
    labelOptionalText: true
  },
  render: renderWithTextField
}`,...(v=(q=o.parameters)==null?void 0:q.docs)==null?void 0:v.source}}};var w,D,A;d.parameters={...d.parameters,docs:{...(w=d.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    children: "Shipping Address",
    formLayout: "side-by-side",
    labelWithEditIcon: true
  },
  render: renderWithTextField
}`,...(A=(D=d.parameters)==null?void 0:D.docs)==null?void 0:A.source}}};var R,B,C;l.parameters={...l.parameters,docs:{...(R=l.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    children: "Configuration",
    formLayout: "side-by-side",
    labelWithEditIcon: true
  },
  render: renderWithTextField
}`,...(C=(B=l.parameters)==null?void 0:B.docs)==null?void 0:C.source}}};const ne=["Default","StackedDefault","StackedRequired","StackedWithEditIcon","SideBySideDefault","RequiredSuppressesOptionalText","BooleanOptionalText","WithEditIcon","LayerOneSideBySide"];export{o as BooleanOptionalText,r as Default,l as LayerOneSideBySide,s as RequiredSuppressesOptionalText,i as SideBySideDefault,t as StackedDefault,a as StackedRequired,n as StackedWithEditIcon,d as WithEditIcon,ne as __namedExportsOrder,ae as default};

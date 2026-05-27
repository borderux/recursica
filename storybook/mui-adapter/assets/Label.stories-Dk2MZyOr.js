import{j as z}from"./iframe-C_ymJL69.js";import{L as N}from"./ReadOnlyField-CmK4Xprm.js";import{T as M}from"./TextField-CXUicuv-.js";import{f as U}from"./commonArgTypes-DcjzA9l3.js";import"./preload-helper-Dp1pzeXC.js";import"./AssistiveElement-BX1CLCG3.js";import"./useFormControl-CCBjUjcD.js";import"./memoTheme-DuK-uO2q.js";import"./styled-CVDphjR5.js";import"./generateUtilityClass-BtcU_pBl.js";import"./generateUtilityClasses-DDbjFgb8.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./FormControlLayout-CxLXgHi1.js";import"./isMuiElement-DGxPhrgs.js";import"./WithReadOnlyWrapper-CTB5FDTb.js";import"./InputBase-eM2MzAVe.js";import"./useForkRef-BlrSiLQa.js";import"./ownerDocument-DW-IO8s5.js";import"./getActiveElement-BwNsGdKK.js";import"./ownerWindow-HkKU3E4x.js";import"./useEventCallback-guZE-voT.js";import"./debounce-Be36O1Ab.js";import"./isHostComponent-DVu5iVWx.js";const le={title:"UI-Kit/Label",component:N,tags:["autodocs"],parameters:{docs:{description:{component:"The `Label` component is a strict Recursica-styled wrapper around MUI's native `InputLabel`. It serves as the primary compositional primitive for all form fields, preserving MUI's accessibility associations and context while strictly enforcing the Recursica atomic design system.\n\n### Usage with Form Inputs\nWhen working with form structures, render this `Label` component directly above your inputs or supply it to a component's overriding properties. The component automatically maps structural layout dimensions, dynamic alignment (`left` vs `right`), custom indicator gaps, and integrates a customized `optionalText` and `withEditIcon` flow that safely bypasses MUI's native required asterisk mechanisms."}},controls:{include:["labelSize","labelAlignment","required","labelOptionalText","labelWithEditIcon","children"]}},argTypes:{...U}},e=({children:L,...R})=>z.jsx(M,{label:L,placeholder:"Form Control primitive mapped...",...R}),r={args:{children:"Dynamic Label (Controls)",labelSize:"default",labelAlignment:"left",required:!1,labelOptionalText:"",labelWithEditIcon:!1},render:e},t={args:{children:"Email Address"},render:e},a={args:{children:"Primary Network Node",required:!0},render:e},n={args:{children:"Environment Variables",labelWithEditIcon:!0},render:e},i={args:{children:"Status",labelSize:"default"},render:e},s={args:{children:"Full Name",required:!0,labelOptionalText:"This should not render"},render:e},o={args:{children:"Middle Initial",labelOptionalText:!0},render:e},l={args:{children:"Shipping Address",labelWithEditIcon:!0},render:e};var d,c,p;r.parameters={...r.parameters,docs:{...(d=r.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    children: "Dynamic Label (Controls)",
    labelSize: "default",
    labelAlignment: "left",
    required: false,
    labelOptionalText: "",
    labelWithEditIcon: false
  },
  render: renderWithTextField
}`,...(p=(c=r.parameters)==null?void 0:c.docs)==null?void 0:p.source}}};var m,u,h;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    children: "Email Address"
  },
  render: renderWithTextField
}`,...(h=(u=t.parameters)==null?void 0:u.docs)==null?void 0:h.source}}};var g,b,f;a.parameters={...a.parameters,docs:{...(g=a.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    children: "Primary Network Node",
    required: true
  },
  render: renderWithTextField
}`,...(f=(b=a.parameters)==null?void 0:b.docs)==null?void 0:f.source}}};var S,T,x;n.parameters={...n.parameters,docs:{...(S=n.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    children: "Environment Variables",
    labelWithEditIcon: true
  },
  render: renderWithTextField
}`,...(x=(T=n.parameters)==null?void 0:T.docs)==null?void 0:x.source}}};var y,I,W;i.parameters={...i.parameters,docs:{...(y=i.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    children: "Status",
    labelSize: "default"
  },
  render: renderWithTextField
}`,...(W=(I=i.parameters)==null?void 0:I.docs)==null?void 0:W.source}}};var E,F,q;s.parameters={...s.parameters,docs:{...(E=s.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    children: "Full Name",
    required: true,
    labelOptionalText: "This should not render"
  },
  render: renderWithTextField
}`,...(q=(F=s.parameters)==null?void 0:F.docs)==null?void 0:q.source}}};var O,v,k;o.parameters={...o.parameters,docs:{...(O=o.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    children: "Middle Initial",
    labelOptionalText: true
  },
  render: renderWithTextField
}`,...(k=(v=o.parameters)==null?void 0:v.docs)==null?void 0:k.source}}};var w,A,D;l.parameters={...l.parameters,docs:{...(w=l.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    children: "Shipping Address",
    labelWithEditIcon: true
  },
  render: renderWithTextField
}`,...(D=(A=l.parameters)==null?void 0:A.docs)==null?void 0:D.source}}};const de=["Default","StackedDefault","StackedRequired","StackedWithEditIcon","SideBySideDefault","RequiredSuppressesOptionalText","BooleanOptionalText","WithEditIcon"];export{o as BooleanOptionalText,r as Default,s as RequiredSuppressesOptionalText,i as SideBySideDefault,t as StackedDefault,a as StackedRequired,n as StackedWithEditIcon,l as WithEditIcon,de as __namedExportsOrder,le as default};

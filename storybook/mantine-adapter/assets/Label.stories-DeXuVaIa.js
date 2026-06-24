import{j as M}from"./iframe-oYtE5cjn.js";import{L as j}from"./ReadOnlyField-KdWilfXH.js";import{T as P}from"./TextField-hV6UIwG4.js";import{f as U}from"./commonArgTypes-DcjzA9l3.js";import"./preload-helper-Dp1pzeXC.js";import"./get-size-DSTSojjy.js";import"./factory-cPRSk-ET.js";import"./polymorphic-factory-dVyCEWHC.js";import"./create-optional-context-e10W-B_s.js";import"./use-resolved-styles-api-KWpaybiB.js";import"./CloseButton-Tu_9aGqV.js";import"./UnstyledButton-tscyQpQ2.js";import"./use-id-HhrMXFTp.js";import"./AssistiveElement-BCVSpv8J.js";import"./WithReadOnlyWrapper-ehowdbDA.js";const ne={title:"UI-Kit/Label",component:j,tags:["autodocs"],parameters:{docs:{description:{component:"The `Label` component is a strict Recursica-styled wrapper around Mantine's native `Input.Label`. It serves as the primary compositional primitive for all form fields, preserving Mantine's accessibility associations and context while strictly enforcing the Recursica atomic design system.\n\n### Usage with Form Inputs\nWhen working with form structures, render this `Label` component directly above your inputs or supply it to a component's overriding properties. The component automatically maps structural layout dimensions, dynamic alignment (`left` vs `right`), custom indicator gaps, and integrates a customized `optionalText` and `withEditIcon` flow that safely bypasses Mantine's native required asterisk mechanisms."}}},argTypes:{...U}},e=({children:N,...z})=>M.jsx(P,{label:N,placeholder:"Form Control primitive mapped...",...z}),r={args:{children:"Dynamic Label (Controls)",labelSize:"default",labelAlignment:"left",required:!1,labelOptionalText:"",labelWithEditIcon:!1},render:e},t={args:{children:"Email Address"},render:e},a={args:{children:"Primary Network Node",required:!0},render:e},n={args:{children:"Environment Variables",labelWithEditIcon:!0},render:e},i={args:{children:"Status",labelSize:"default"},render:e},s={args:{children:"Full Name",required:!0,labelOptionalText:"This should not render"},render:e},o={args:{children:"Middle Initial",labelOptionalText:!0},render:e},d={args:{children:"Shipping Address",labelWithEditIcon:!0},render:e},l={args:{children:"Configuration",labelWithEditIcon:!0},render:e};var c,p,m;r.parameters={...r.parameters,docs:{...(c=r.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    children: "Dynamic Label (Controls)",
    labelSize: "default",
    labelAlignment: "left",
    required: false,
    labelOptionalText: "",
    labelWithEditIcon: false
  },
  render: renderWithTextField
}`,...(m=(p=r.parameters)==null?void 0:p.docs)==null?void 0:m.source}}};var u,h,g;t.parameters={...t.parameters,docs:{...(u=t.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    children: "Email Address"
  },
  render: renderWithTextField
}`,...(g=(h=t.parameters)==null?void 0:h.docs)==null?void 0:g.source}}};var b,f,S;a.parameters={...a.parameters,docs:{...(b=a.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    children: "Primary Network Node",
    required: true
  },
  render: renderWithTextField
}`,...(S=(f=a.parameters)==null?void 0:f.docs)==null?void 0:S.source}}};var T,x,y;n.parameters={...n.parameters,docs:{...(T=n.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    children: "Environment Variables",
    labelWithEditIcon: true
  },
  render: renderWithTextField
}`,...(y=(x=n.parameters)==null?void 0:x.docs)==null?void 0:y.source}}};var W,E,I;i.parameters={...i.parameters,docs:{...(W=i.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    children: "Status",
    labelSize: "default"
  },
  render: renderWithTextField
}`,...(I=(E=i.parameters)==null?void 0:E.docs)==null?void 0:I.source}}};var F,O,q;s.parameters={...s.parameters,docs:{...(F=s.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    children: "Full Name",
    required: true,
    labelOptionalText: "This should not render"
  },
  render: renderWithTextField
}`,...(q=(O=s.parameters)==null?void 0:O.docs)==null?void 0:q.source}}};var v,k,L;o.parameters={...o.parameters,docs:{...(v=o.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    children: "Middle Initial",
    labelOptionalText: true
  },
  render: renderWithTextField
}`,...(L=(k=o.parameters)==null?void 0:k.docs)==null?void 0:L.source}}};var w,D,A;d.parameters={...d.parameters,docs:{...(w=d.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    children: "Shipping Address",
    labelWithEditIcon: true
  },
  render: renderWithTextField
}`,...(A=(D=d.parameters)==null?void 0:D.docs)==null?void 0:A.source}}};var R,B,C;l.parameters={...l.parameters,docs:{...(R=l.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    children: "Configuration",
    labelWithEditIcon: true
  },
  render: renderWithTextField
}`,...(C=(B=l.parameters)==null?void 0:B.docs)==null?void 0:C.source}}};const ie=["Default","StackedDefault","StackedRequired","StackedWithEditIcon","SideBySideDefault","RequiredSuppressesOptionalText","BooleanOptionalText","WithEditIcon","LayerOneSideBySide"];export{o as BooleanOptionalText,r as Default,l as LayerOneSideBySide,s as RequiredSuppressesOptionalText,i as SideBySideDefault,t as StackedDefault,a as StackedRequired,n as StackedWithEditIcon,d as WithEditIcon,ie as __namedExportsOrder,ne as default};

import{j as c}from"./iframe-CphPjEVK.js";import{L as P}from"./FormControlWrapper-Dkkvy1Hl.js";import{T as U}from"./adapter-common-BLbBFVzm.js";import{T as V}from"./TextField-zK4i_wUL.js";import"./preload-helper-Dp1pzeXC.js";import"./filterStylingProps-Cd5Jg4Cp.js";import"./get-size-Cyen0TVy.js";import"./factory-B-0KiR2C.js";import"./polymorphic-factory-BY4dselc.js";import"./UnstyledButton-C6M6-eqI.js";import"./use-id-DeuPlgQc.js";import"./AssistiveElement-C4XrV8E3.js";import"./ReadOnlyField-CUdHhLT6.js";const ae={title:"UI-Kit/Label",component:P,tags:["autodocs"],parameters:{docs:{description:{component:"The `Label` component is a strict Recursica-styled wrapper around Mantine's native `Input.Label`. It serves as the primary compositional primitive for all form fields, preserving Mantine's accessibility associations and context while strictly enforcing the Recursica atomic design system.\n\n### Usage with Form Inputs\nWhen working with form structures, render this `Label` component directly above your inputs or supply it to a component's overriding properties. The component automatically maps structural layout dimensions, dynamic alignment (`left` vs `right`), custom indicator gaps, and integrates a customized `optionalText` and `withEditIcon` flow that safely bypasses Mantine's native required asterisk mechanisms."}}},argTypes:{formLayout:{control:"radio",options:["stacked","side-by-side"],description:"Layout structure of the Label component"},labelSize:{control:"radio",options:["default","small"]},labelAlignment:{control:"radio",options:["left","right"],description:"Text and layout alignment for the Label"},required:{control:"boolean"},labelOptionalText:{control:"text",description:"String or boolean (if true, renders 'Optional')"},labelWithEditIcon:{control:"boolean"},layer:{control:"radio",options:[0,1,2,3],description:"The design system layer context",table:{category:"Story Controls"}}}},e=({layer:N=0,children:M,...j})=>c.jsx(U,{layer:N,style:{padding:"24px"},children:c.jsx(V,{label:M,placeholder:"Form Control primitive mapped...",...j})}),r={args:{children:"Dynamic Label (Controls)",formLayout:"stacked",labelSize:"default",labelAlignment:"left",required:!1,labelOptionalText:"",labelWithEditIcon:!1,layer:0},render:e},t={args:{children:"Email Address",formLayout:"stacked"},render:e},a={args:{children:"Primary Network Node",formLayout:"stacked",required:!0},render:e},n={args:{children:"Environment Variables",formLayout:"stacked",labelWithEditIcon:!0},render:e},o={args:{children:"Status",formLayout:"side-by-side",labelSize:"default"},render:e},i={args:{children:"Full Name",formLayout:"stacked",required:!0,labelOptionalText:"This should not render"},render:e},s={args:{children:"Middle Initial",formLayout:"side-by-side",labelOptionalText:!0},render:e},d={args:{children:"Shipping Address",formLayout:"side-by-side",labelWithEditIcon:!0},render:e},l={args:{children:"Configuration",formLayout:"side-by-side",labelWithEditIcon:!0,layer:1},render:e};var m,u,p;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    children: "Dynamic Label (Controls)",
    formLayout: "stacked",
    labelSize: "default",
    labelAlignment: "left",
    required: false,
    labelOptionalText: "",
    labelWithEditIcon: false,
    layer: 0
  },
  render: renderWithTextField
}`,...(p=(u=r.parameters)==null?void 0:u.docs)==null?void 0:p.source}}};var h,y,f;t.parameters={...t.parameters,docs:{...(h=t.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    children: "Email Address",
    formLayout: "stacked"
  },
  render: renderWithTextField
}`,...(f=(y=t.parameters)==null?void 0:y.docs)==null?void 0:f.source}}};var b,g,S;a.parameters={...a.parameters,docs:{...(b=a.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    children: "Primary Network Node",
    formLayout: "stacked",
    required: true
  },
  render: renderWithTextField
}`,...(S=(g=a.parameters)==null?void 0:g.docs)==null?void 0:S.source}}};var x,L,T;n.parameters={...n.parameters,docs:{...(x=n.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    children: "Environment Variables",
    formLayout: "stacked",
    labelWithEditIcon: true
  },
  render: renderWithTextField
}`,...(T=(L=n.parameters)==null?void 0:L.docs)==null?void 0:T.source}}};var W,k,E;o.parameters={...o.parameters,docs:{...(W=o.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    children: "Status",
    formLayout: "side-by-side",
    labelSize: "default"
  },
  render: renderWithTextField
}`,...(E=(k=o.parameters)==null?void 0:k.docs)==null?void 0:E.source}}};var I,F,O;i.parameters={...i.parameters,docs:{...(I=i.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    children: "Full Name",
    formLayout: "stacked",
    required: true,
    labelOptionalText: "This should not render"
  },
  render: renderWithTextField
}`,...(O=(F=i.parameters)==null?void 0:F.docs)==null?void 0:O.source}}};var q,v,w;s.parameters={...s.parameters,docs:{...(q=s.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    children: "Middle Initial",
    formLayout: "side-by-side",
    labelOptionalText: true
  },
  render: renderWithTextField
}`,...(w=(v=s.parameters)==null?void 0:v.docs)==null?void 0:w.source}}};var D,A,R;d.parameters={...d.parameters,docs:{...(D=d.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    children: "Shipping Address",
    formLayout: "side-by-side",
    labelWithEditIcon: true
  },
  render: renderWithTextField
}`,...(R=(A=d.parameters)==null?void 0:A.docs)==null?void 0:R.source}}};var z,B,C;l.parameters={...l.parameters,docs:{...(z=l.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    children: "Configuration",
    formLayout: "side-by-side",
    labelWithEditIcon: true,
    layer: 1
  },
  render: renderWithTextField
}`,...(C=(B=l.parameters)==null?void 0:B.docs)==null?void 0:C.source}}};const ne=["Default","StackedDefault","StackedRequired","StackedWithEditIcon","SideBySideDefault","RequiredSuppressesOptionalText","BooleanOptionalText","WithEditIcon","LayerOneSideBySide"];export{s as BooleanOptionalText,r as Default,l as LayerOneSideBySide,i as RequiredSuppressesOptionalText,o as SideBySideDefault,t as StackedDefault,a as StackedRequired,n as StackedWithEditIcon,d as WithEditIcon,ne as __namedExportsOrder,ae as default};

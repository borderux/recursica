import{j as e,$ as A}from"./iframe-B9jVSv9g.js";import{B as c}from"./Button-Co6R1U8P.js";import"./preload-helper-Dp1pzeXC.js";import"./factory-qt3TIjIQ.js";import"./get-size-CZBO4470.js";import"./polymorphic-factory-BaiPjVv6.js";import"./Loader-Cmrjy8eV.js";import"./Transition-CmXN8cps.js";import"./index-526MuFmh.js";import"./index-Car0LSP-.js";import"./use-reduced-motion-DONktsbQ.js";import"./UnstyledButton-C0D8UK82.js";const V={title:"UI-Kit/Button",component:c,tags:["autodocs"],argTypes:{variant:{control:"select",options:["solid","outline","text"],description:"The visual variant of the button"},size:{control:"radio",options:["default","small"],description:"The size of the button"}}},n={args:{children:"Explore Button",variant:"solid",size:"default",disabled:!1},render:({withLayer:r,layer:C,..._})=>e.jsx(c,{..._})},t={args:{children:"Solid Default",variant:"solid",size:"default"}},a={args:{children:"Outline Small",variant:"outline",size:"small"}},s={args:{children:"Text With Icon",variant:"text",size:"default",icon:e.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"11",cy:"11",r:"8"}),e.jsx("line",{x1:"21",y1:"21",x2:"16.65",y2:"16.65"})]})}},o={args:{children:"Layer 1 Solid",variant:"solid",size:"default"},render:r=>e.jsx(A,{layer:1,style:{padding:"24px"},children:e.jsx(c,{...r})})},i={args:{children:"Disabled Solid",variant:"solid",size:"default",disabled:!0}},l={args:{children:"Button as Link",variant:"solid",size:"default",component:"a",href:"https://example.com",target:"_blank"}},d={args:{children:"This is an exceptionally long button label designed to demonstrate how the component handles text overflow by applying an ellipsis rather than breaking the layout or wrapping to multiple lines.",variant:"solid",size:"default"},render:r=>e.jsx("div",{style:{maxWidth:"250px"},children:e.jsx(c,{...r})})};var p,u,m;n.parameters={...n.parameters,docs:{...(p=n.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    children: "Explore Button",
    variant: "solid",
    size: "default",
    disabled: false
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => {
    return <Button {...args} />;
  }
}`,...(m=(u=n.parameters)==null?void 0:u.docs)==null?void 0:m.source}}};var h,g,x;t.parameters={...t.parameters,docs:{...(h=t.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    children: "Solid Default",
    variant: "solid",
    size: "default"
  }
}`,...(x=(g=t.parameters)==null?void 0:g.docs)==null?void 0:x.source}}};var y,f,v;a.parameters={...a.parameters,docs:{...(y=a.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    children: "Outline Small",
    variant: "outline",
    size: "small"
  }
}`,...(v=(f=a.parameters)==null?void 0:f.docs)==null?void 0:v.source}}};var S,b,w;s.parameters={...s.parameters,docs:{...(S=s.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    children: "Text With Icon",
    variant: "text",
    size: "default",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
  }
}`,...(w=(b=s.parameters)==null?void 0:b.docs)==null?void 0:w.source}}};var z,L,k;o.parameters={...o.parameters,docs:{...(z=o.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    children: "Layer 1 Solid",
    variant: "solid",
    size: "default"
  },
  render: (args: ButtonStoryProps) => <Layer layer={1} style={{
    padding: "24px"
  }}>
      <Button {...args} />
    </Layer>
}`,...(k=(L=o.parameters)==null?void 0:L.docs)==null?void 0:k.source}}};var B,j,T;i.parameters={...i.parameters,docs:{...(B=i.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    children: "Disabled Solid",
    variant: "solid",
    size: "default",
    disabled: true
  }
}`,...(T=(j=i.parameters)==null?void 0:j.docs)==null?void 0:T.source}}};var D,W,O;l.parameters={...l.parameters,docs:{...(D=l.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    children: "Button as Link",
    variant: "solid",
    size: "default",
    component: "a",
    href: "https://example.com",
    target: "_blank"
  }
}`,...(O=(W=l.parameters)==null?void 0:W.docs)==null?void 0:O.source}}};var I,E,P;d.parameters={...d.parameters,docs:{...(I=d.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    children: "This is an exceptionally long button label designed to demonstrate how the component handles text overflow by applying an ellipsis rather than breaking the layout or wrapping to multiple lines.",
    variant: "solid",
    size: "default"
  },
  render: (args: ButtonStoryProps) => <div style={{
    maxWidth: "250px"
  }}>
      <Button {...args} />
    </div>
}`,...(P=(E=d.parameters)==null?void 0:E.docs)==null?void 0:P.source}}};const X=["Default","SolidDefault","OutlineSmall","TextWithIcon","LayerOneSolid","DisabledSolid","PolymorphicAsLink","TruncatedLabel"];export{n as Default,i as DisabledSolid,o as LayerOneSolid,a as OutlineSmall,l as PolymorphicAsLink,t as SolidDefault,s as TextWithIcon,d as TruncatedLabel,X as __namedExportsOrder,V as default};

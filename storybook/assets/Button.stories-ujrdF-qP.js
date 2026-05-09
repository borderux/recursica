import{j as e,$ as I}from"./iframe-CaXTvM-c.js";import{B as l}from"./Button-S0vpKXj8.js";import"./preload-helper-Dp1pzeXC.js";import"./factory-CNB8C45Y.js";import"./get-size-D647OXYC.js";import"./polymorphic-factory-LmR8FwzZ.js";import"./Loader-BZHYyjEs.js";import"./Transition-Cz1MRVqP.js";import"./index-BL3PIr5j.js";import"./index-y5KRRxmP.js";import"./use-reduced-motion-CsUetKP1.js";import"./UnstyledButton-Bv7Y_INO.js";const J={title:"UI-Kit/Button",component:l,tags:["autodocs"],argTypes:{variant:{control:"select",options:["solid","outline","text"],description:"The visual variant of the button"},size:{control:"radio",options:["default","small"],description:"The size of the button"}}},r={args:{children:"Explore Button",variant:"solid",size:"default",disabled:!1},render:({withLayer:d,layer:E,...W})=>e.jsx(l,{...W})},n={args:{children:"Solid Default",variant:"solid",size:"default"}},t={args:{children:"Outline Small",variant:"outline",size:"small"}},a={args:{children:"Text With Icon",variant:"text",size:"default",icon:e.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"11",cy:"11",r:"8"}),e.jsx("line",{x1:"21",y1:"21",x2:"16.65",y2:"16.65"})]})}},s={args:{children:"Layer 1 Solid",variant:"solid",size:"default"},render:d=>e.jsx(I,{layer:1,style:{padding:"24px"},children:e.jsx(l,{...d})})},o={args:{children:"Disabled Solid",variant:"solid",size:"default",disabled:!0}},i={args:{children:"Button as Link",variant:"solid",size:"default",component:"a",href:"https://example.com",target:"_blank"}};var c,u,p;r.parameters={...r.parameters,docs:{...(c=r.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
}`,...(p=(u=r.parameters)==null?void 0:u.docs)==null?void 0:p.source}}};var m,h,g;n.parameters={...n.parameters,docs:{...(m=n.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    children: "Solid Default",
    variant: "solid",
    size: "default"
  }
}`,...(g=(h=n.parameters)==null?void 0:h.docs)==null?void 0:g.source}}};var x,f,y;t.parameters={...t.parameters,docs:{...(x=t.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    children: "Outline Small",
    variant: "outline",
    size: "small"
  }
}`,...(y=(f=t.parameters)==null?void 0:f.docs)==null?void 0:y.source}}};var v,S,z;a.parameters={...a.parameters,docs:{...(v=a.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    children: "Text With Icon",
    variant: "text",
    size: "default",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
  }
}`,...(z=(S=a.parameters)==null?void 0:S.docs)==null?void 0:z.source}}};var L,k,w;s.parameters={...s.parameters,docs:{...(L=s.parameters)==null?void 0:L.docs,source:{originalSource:`{
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
}`,...(w=(k=s.parameters)==null?void 0:k.docs)==null?void 0:w.source}}};var b,B,j;o.parameters={...o.parameters,docs:{...(b=o.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    children: "Disabled Solid",
    variant: "solid",
    size: "default",
    disabled: true
  }
}`,...(j=(B=o.parameters)==null?void 0:B.docs)==null?void 0:j.source}}};var D,O,T;i.parameters={...i.parameters,docs:{...(D=i.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    children: "Button as Link",
    variant: "solid",
    size: "default",
    component: "a",
    href: "https://example.com",
    target: "_blank"
  }
}`,...(T=(O=i.parameters)==null?void 0:O.docs)==null?void 0:T.source}}};const M=["Default","SolidDefault","OutlineSmall","TextWithIcon","LayerOneSolid","DisabledSolid","PolymorphicAsLink"];export{r as Default,o as DisabledSolid,s as LayerOneSolid,t as OutlineSmall,i as PolymorphicAsLink,n as SolidDefault,a as TextWithIcon,M as __namedExportsOrder,J as default};

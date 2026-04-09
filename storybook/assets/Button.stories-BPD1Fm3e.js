import{j as e}from"./iframe-uF_HBlgp.js";import{B as l}from"./Button-BWH_iwDD.js";import{T as D}from"./adapter-common-DIDtRk04.js";import"./preload-helper-Dp1pzeXC.js";import"./filterStylingProps-Cd5Jg4Cp.js";import"./get-size-CyTqK_sX.js";import"./factory-DPW3mWUw.js";import"./polymorphic-factory-CALd9GjX.js";import"./index-DhE6XSEx.js";import"./index-D4CAGBdm.js";import"./use-reduced-motion-A6jGeq3U.js";import"./UnstyledButton-BeKfx2Cj.js";const A={title:"UI-Kit/Button",component:l,tags:["autodocs"],argTypes:{variant:{control:"select",options:["solid","outline","text"],description:"The visual variant of the button"},size:{control:"radio",options:["default","small"],description:"The size of the button"},disabled:{control:"boolean"},layer:{control:"radio",options:[0,1,2,3],description:"The design system layer context",table:{category:"Story Controls"}}}},r={args:{children:"Explore Button",variant:"solid",size:"default",disabled:!1,layer:0},render:({layer:i=0,...T})=>e.jsx(D,{layer:i,style:{padding:"24px"},children:e.jsx(l,{...T})})},t={args:{children:"Solid Default",variant:"solid",size:"default"}},a={args:{children:"Outline Small",variant:"outline",size:"small"}},n={args:{children:"Text With Icon",variant:"text",size:"default",icon:e.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"11",cy:"11",r:"8"}),e.jsx("line",{x1:"21",y1:"21",x2:"16.65",y2:"16.65"})]})}},o={args:{children:"Layer 1 Solid",variant:"solid",size:"default"},render:i=>e.jsx(D,{layer:1,style:{padding:"24px"},children:e.jsx(l,{...i})})},s={args:{children:"Disabled Solid",variant:"solid",size:"default",disabled:!0}};var d,c,u;r.parameters={...r.parameters,docs:{...(d=r.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    children: "Explore Button",
    variant: "solid",
    size: "default",
    disabled: false,
    layer: 0 // default layer
  },
  render: ({
    layer = 0,
    ...args
  }) => {
    return <Layer layer={layer as 0 | 1 | 2 | 3} style={{
      padding: "24px"
    }}>
        <Button {...args} />
      </Layer>;
  }
}`,...(u=(c=r.parameters)==null?void 0:c.docs)==null?void 0:u.source}}};var p,m,g;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    children: "Solid Default",
    variant: "solid",
    size: "default"
  }
}`,...(g=(m=t.parameters)==null?void 0:m.docs)==null?void 0:g.source}}};var x,h,y;a.parameters={...a.parameters,docs:{...(x=a.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    children: "Outline Small",
    variant: "outline",
    size: "small"
  }
}`,...(y=(h=a.parameters)==null?void 0:h.docs)==null?void 0:y.source}}};var f,S,v;n.parameters={...n.parameters,docs:{...(f=n.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    children: "Text With Icon",
    variant: "text",
    size: "default",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
  }
}`,...(v=(S=n.parameters)==null?void 0:S.docs)==null?void 0:v.source}}};var z,b,w;o.parameters={...o.parameters,docs:{...(z=o.parameters)==null?void 0:z.docs,source:{originalSource:`{
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
}`,...(w=(b=o.parameters)==null?void 0:b.docs)==null?void 0:w.source}}};var L,j,B;s.parameters={...s.parameters,docs:{...(L=s.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    children: "Disabled Solid",
    variant: "solid",
    size: "default",
    disabled: true
  }
}`,...(B=(j=s.parameters)==null?void 0:j.docs)==null?void 0:B.source}}};const F=["Default","SolidDefault","OutlineSmall","TextWithIcon","LayerOneSolid","DisabledSolid"];export{r as Default,s as DisabledSolid,o as LayerOneSolid,a as OutlineSmall,t as SolidDefault,n as TextWithIcon,F as __namedExportsOrder,A as default};

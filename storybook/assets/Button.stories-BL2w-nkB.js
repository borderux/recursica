import{j as r}from"./iframe-BmfdKJen.js";import{B as n}from"./Button-BNUwvgkq.js";import{T as D}from"./adapter-common-DrbnELqL.js";import"./preload-helper-Dp1pzeXC.js";import"./filterStylingProps-D6XLjxMq.js";import"./polymorphic-factory-kKMArxXM.js";import"./index-B0QkiIJ6.js";import"./index-BUxbz3FW.js";import"./UnstyledButton-OYv4JF8d.js";const U={title:"UI-Kit/Button",component:n,tags:["autodocs"],argTypes:{variant:{control:"select",options:["solid","outline","text"],description:"The visual variant of the button"},size:{control:"radio",options:["default","small"],description:"The size of the button"},disabled:{control:"boolean"},layer:{control:"radio",options:[0,1,2,3],description:"The design system layer context",table:{category:"Story Controls"}}}},a={args:{children:"Explore Button",variant:"solid",size:"default",disabled:!1,layer:0},render:({layer:e=0,...T})=>r.jsx(D,{layer:e,style:{padding:"24px"},children:r.jsx(n,{...T})})},t={args:{children:"Solid Default",variant:"solid",size:"default"},render:e=>r.jsx(n,{...e})},s={args:{children:"Outline Small",variant:"outline",size:"small"},render:e=>r.jsx(n,{...e})},o={args:{children:"Text With Icon",variant:"text",size:"default",icon:r.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[r.jsx("circle",{cx:"11",cy:"11",r:"8"}),r.jsx("line",{x1:"21",y1:"21",x2:"16.65",y2:"16.65"})]})},render:e=>r.jsx(n,{...e})},i={args:{children:"Layer 1 Solid",variant:"solid",size:"default"},render:e=>r.jsx(D,{layer:1,style:{padding:"24px"},children:r.jsx(n,{...e})})},l={args:{children:"Disabled Solid",variant:"solid",size:"default",disabled:!0},render:e=>r.jsx(n,{...e})};var d,c,u;a.parameters={...a.parameters,docs:{...(d=a.parameters)==null?void 0:d.docs,source:{originalSource:`{
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
}`,...(u=(c=a.parameters)==null?void 0:c.docs)==null?void 0:u.source}}};var p,m,g;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    children: "Solid Default",
    variant: "solid",
    size: "default"
  },
  render: args => <Button {...args} />
}`,...(g=(m=t.parameters)==null?void 0:m.docs)==null?void 0:g.source}}};var x,h,y;s.parameters={...s.parameters,docs:{...(x=s.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    children: "Outline Small",
    variant: "outline",
    size: "small"
  },
  render: args => <Button {...args} />
}`,...(y=(h=s.parameters)==null?void 0:h.docs)==null?void 0:y.source}}};var f,S,v;o.parameters={...o.parameters,docs:{...(f=o.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    children: "Text With Icon",
    variant: "text",
    size: "default",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
  },
  render: args => <Button {...args} />
}`,...(v=(S=o.parameters)==null?void 0:S.docs)==null?void 0:v.source}}};var j,z,b;i.parameters={...i.parameters,docs:{...(j=i.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    children: "Layer 1 Solid",
    variant: "solid",
    size: "default"
  },
  render: args => <Layer layer={1} style={{
    padding: "24px"
  }}>
      <Button {...args} />
    </Layer>
}`,...(b=(z=i.parameters)==null?void 0:z.docs)==null?void 0:b.source}}};var B,w,L;l.parameters={...l.parameters,docs:{...(B=l.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    children: "Disabled Solid",
    variant: "solid",
    size: "default",
    disabled: true
  },
  render: args => <Button {...args} />
}`,...(L=(w=l.parameters)==null?void 0:w.docs)==null?void 0:L.source}}};const q=["Default","SolidDefault","OutlineSmall","TextWithIcon","LayerOneSolid","DisabledSolid"];export{a as Default,l as DisabledSolid,i as LayerOneSolid,s as OutlineSmall,t as SolidDefault,o as TextWithIcon,q as __namedExportsOrder,U as default};

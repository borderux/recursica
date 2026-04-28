import{j as e,$ as L}from"./iframe-BHhWYZEC.js";import{B as l}from"./Button-BiyBIasi.js";import"./preload-helper-Dp1pzeXC.js";import"./get-size-BlbtXTyo.js";import"./factory-CVE1eDgt.js";import"./polymorphic-factory-CnLU5YW3.js";import"./Loader-BcO3V0vd.js";import"./Transition-C-__W7iL.js";import"./index-B1OktoKF.js";import"./index-BfTzjhWN.js";import"./use-reduced-motion-W7Y77d89.js";import"./UnstyledButton-BRfGAqO1.js";const $={title:"UI-Kit/Button",component:l,tags:["autodocs"],argTypes:{variant:{control:"select",options:["solid","outline","text"],description:"The visual variant of the button"},size:{control:"radio",options:["default","small"],description:"The size of the button"},disabled:{control:"boolean"}}},r={args:{children:"Explore Button",variant:"solid",size:"default",disabled:!1},render:i=>e.jsx(l,{...i})},t={args:{children:"Solid Default",variant:"solid",size:"default"}},a={args:{children:"Outline Small",variant:"outline",size:"small"}},n={args:{children:"Text With Icon",variant:"text",size:"default",icon:e.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"11",cy:"11",r:"8"}),e.jsx("line",{x1:"21",y1:"21",x2:"16.65",y2:"16.65"})]})}},o={args:{children:"Layer 1 Solid",variant:"solid",size:"default"},render:i=>e.jsx(L,{layer:1,style:{padding:"24px"},children:e.jsx(l,{...i})})},s={args:{children:"Disabled Solid",variant:"solid",size:"default",disabled:!0}};var d,c,u;r.parameters={...r.parameters,docs:{...(d=r.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    children: "Explore Button",
    variant: "solid",
    size: "default",
    disabled: false
  },
  render: args => {
    return <Button {...args} />;
  }
}`,...(u=(c=r.parameters)==null?void 0:c.docs)==null?void 0:u.source}}};var p,m,g;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    children: "Solid Default",
    variant: "solid",
    size: "default"
  }
}`,...(g=(m=t.parameters)==null?void 0:m.docs)==null?void 0:g.source}}};var h,x,f;a.parameters={...a.parameters,docs:{...(h=a.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    children: "Outline Small",
    variant: "outline",
    size: "small"
  }
}`,...(f=(x=a.parameters)==null?void 0:x.docs)==null?void 0:f.source}}};var S,v,y;n.parameters={...n.parameters,docs:{...(S=n.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    children: "Text With Icon",
    variant: "text",
    size: "default",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
  }
}`,...(y=(v=n.parameters)==null?void 0:v.docs)==null?void 0:y.source}}};var z,b,w;o.parameters={...o.parameters,docs:{...(z=o.parameters)==null?void 0:z.docs,source:{originalSource:`{
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
}`,...(w=(b=o.parameters)==null?void 0:b.docs)==null?void 0:w.source}}};var j,B,D;s.parameters={...s.parameters,docs:{...(j=s.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    children: "Disabled Solid",
    variant: "solid",
    size: "default",
    disabled: true
  }
}`,...(D=(B=s.parameters)==null?void 0:B.docs)==null?void 0:D.source}}};const q=["Default","SolidDefault","OutlineSmall","TextWithIcon","LayerOneSolid","DisabledSolid"];export{r as Default,s as DisabledSolid,o as LayerOneSolid,a as OutlineSmall,t as SolidDefault,n as TextWithIcon,q as __namedExportsOrder,$ as default};

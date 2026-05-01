import{j as e,$ as k}from"./iframe-62VCHLAo.js";import{B as o}from"./Button-Bl7Z4z3x.js";import"./preload-helper-Dp1pzeXC.js";import"./get-size-qFIEsQoM.js";import"./factory-C1p_Iv34.js";import"./polymorphic-factory-VSsKQd_s.js";import"./Loader-BFDSj41w.js";import"./Transition-CHOagRjC.js";import"./index-DoaP3_2_.js";import"./index-BQHFkE77.js";import"./use-reduced-motion-BS3cKuM5.js";import"./UnstyledButton-B7jmV6FW.js";const A={title:"UI-Kit/Button",component:o,tags:["autodocs"],argTypes:{variant:{control:"select",options:["solid","outline","text"],description:"The visual variant of the button"},size:{control:"radio",options:["default","small"],description:"The size of the button"}}},r={args:{children:"Explore Button",variant:"solid",size:"default",disabled:!1},render:({withLayer:l,layer:O,...D})=>e.jsx(o,{...D})},t={args:{children:"Solid Default",variant:"solid",size:"default"}},n={args:{children:"Outline Small",variant:"outline",size:"small"}},a={args:{children:"Text With Icon",variant:"text",size:"default",icon:e.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"11",cy:"11",r:"8"}),e.jsx("line",{x1:"21",y1:"21",x2:"16.65",y2:"16.65"})]})}},s={args:{children:"Layer 1 Solid",variant:"solid",size:"default"},render:l=>e.jsx(k,{layer:1,style:{padding:"24px"},children:e.jsx(o,{...l})})},i={args:{children:"Disabled Solid",variant:"solid",size:"default",disabled:!0}};var d,c,u;r.parameters={...r.parameters,docs:{...(d=r.parameters)==null?void 0:d.docs,source:{originalSource:`{
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
}`,...(u=(c=r.parameters)==null?void 0:c.docs)==null?void 0:u.source}}};var p,m,g;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    children: "Solid Default",
    variant: "solid",
    size: "default"
  }
}`,...(g=(m=t.parameters)==null?void 0:m.docs)==null?void 0:g.source}}};var h,x,f;n.parameters={...n.parameters,docs:{...(h=n.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    children: "Outline Small",
    variant: "outline",
    size: "small"
  }
}`,...(f=(x=n.parameters)==null?void 0:x.docs)==null?void 0:f.source}}};var y,v,S;a.parameters={...a.parameters,docs:{...(y=a.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    children: "Text With Icon",
    variant: "text",
    size: "default",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
  }
}`,...(S=(v=a.parameters)==null?void 0:v.docs)==null?void 0:S.source}}};var w,z,L;s.parameters={...s.parameters,docs:{...(w=s.parameters)==null?void 0:w.docs,source:{originalSource:`{
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
}`,...(L=(z=s.parameters)==null?void 0:z.docs)==null?void 0:L.source}}};var b,j,B;i.parameters={...i.parameters,docs:{...(b=i.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    children: "Disabled Solid",
    variant: "solid",
    size: "default",
    disabled: true
  }
}`,...(B=(j=i.parameters)==null?void 0:j.docs)==null?void 0:B.source}}};const F=["Default","SolidDefault","OutlineSmall","TextWithIcon","LayerOneSolid","DisabledSolid"];export{r as Default,i as DisabledSolid,s as LayerOneSolid,n as OutlineSmall,t as SolidDefault,a as TextWithIcon,F as __namedExportsOrder,A as default};

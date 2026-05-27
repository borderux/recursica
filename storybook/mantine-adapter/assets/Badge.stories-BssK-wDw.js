import{j as e,$ as W}from"./iframe-CE_LlejV.js";import{B as a}from"./Badge-CNwhrxzW.js";import"./preload-helper-Dp1pzeXC.js";import"./factory-BncmibqV.js";import"./get-size-C83oZ-QB.js";import"./polymorphic-factory-C2wrZH1O.js";const R={title:"UI-Kit/Badge",component:a,tags:["autodocs"],argTypes:{variant:{control:"select",options:["alert","primary-color","success","warning"],description:"The style / intent mapping for the badge"}}},n={args:{children:"Badge Label",variant:"primary-color"},render:({withLayer:r,layer:O,...b})=>e.jsx(a,{...b})},s={args:{children:"Alert Badge",variant:"alert"},render:r=>e.jsx(a,{...r})},t={args:{children:"Primary Badge",variant:"primary-color"},render:r=>e.jsx(a,{...r})},o={args:{children:"Success Badge",variant:"success"},render:r=>e.jsx(a,{...r})},c={args:{children:"Warning Badge",variant:"warning"},render:r=>e.jsx(a,{...r})},i={args:{children:"Layer 1 Alert",variant:"alert"},render:r=>e.jsx(W,{layer:1,style:{padding:"24px"},children:e.jsx(a,{...r})})};var d,g,l;n.parameters={...n.parameters,docs:{...(d=n.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    children: "Badge Label",
    variant: "primary-color"
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => {
    return <Badge {...args} />;
  }
}`,...(l=(g=n.parameters)==null?void 0:g.docs)==null?void 0:l.source}}};var p,m,u;s.parameters={...s.parameters,docs:{...(p=s.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    children: "Alert Badge",
    variant: "alert"
  },
  render: (args: BadgeStoryProps) => <Badge {...args} />
}`,...(u=(m=s.parameters)==null?void 0:m.docs)==null?void 0:u.source}}};var y,B,S;t.parameters={...t.parameters,docs:{...(y=t.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    children: "Primary Badge",
    variant: "primary-color"
  },
  render: (args: BadgeStoryProps) => <Badge {...args} />
}`,...(S=(B=t.parameters)==null?void 0:B.docs)==null?void 0:S.source}}};var h,x,v;o.parameters={...o.parameters,docs:{...(h=o.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    children: "Success Badge",
    variant: "success"
  },
  render: (args: BadgeStoryProps) => <Badge {...args} />
}`,...(v=(x=o.parameters)==null?void 0:x.docs)==null?void 0:v.source}}};var L,j,P;c.parameters={...c.parameters,docs:{...(L=c.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    children: "Warning Badge",
    variant: "warning"
  },
  render: (args: BadgeStoryProps) => <Badge {...args} />
}`,...(P=(j=c.parameters)==null?void 0:j.docs)==null?void 0:P.source}}};var A,f,w;i.parameters={...i.parameters,docs:{...(A=i.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    children: "Layer 1 Alert",
    variant: "alert"
  },
  render: (args: BadgeStoryProps) => <Layer layer={1} style={{
    padding: "24px"
  }}>
      <Badge {...args} />
    </Layer>
}`,...(w=(f=i.parameters)==null?void 0:f.docs)==null?void 0:w.source}}};const U=["Default","StaticAlert","StaticPrimary","StaticSuccess","StaticWarning","LayerOneAlert"];export{n as Default,i as LayerOneAlert,s as StaticAlert,t as StaticPrimary,o as StaticSuccess,c as StaticWarning,U as __namedExportsOrder,R as default};

import{j as e,R as W}from"./iframe-ET1O9uy4.js";import{B as a}from"./Badge-Dj3e02Rb.js";import"./preload-helper-Dp1pzeXC.js";import"./usePreviousProps-BbVycIKH.js";import"./memoTheme-DivAIOBF.js";import"./styled-NHfFC7RQ.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./useSlot-CgtNWb7u.js";import"./mergeSlotProps-DcIUA7x0.js";import"./isHostComponent-DVu5iVWx.js";import"./useForkRef-B2D9i2iU.js";const F={title:"UI-Kit/Badge",component:a,tags:["autodocs"],argTypes:{variant:{control:"select",options:["alert","primary-color","success","warning"],description:"The style / intent mapping for the badge"}}},n={args:{children:"Badge Label",variant:"primary-color"},render:({withLayer:r,layer:O,...b})=>e.jsx(a,{...b})},s={args:{children:"Alert Badge",variant:"alert"},render:r=>e.jsx(a,{...r})},t={args:{children:"Primary Badge",variant:"primary-color"},render:r=>e.jsx(a,{...r})},o={args:{children:"Success Badge",variant:"success"},render:r=>e.jsx(a,{...r})},i={args:{children:"Warning Badge",variant:"warning"},render:r=>e.jsx(a,{...r})},c={args:{children:"Layer 1 Alert",variant:"alert"},render:r=>e.jsx(W,{layer:1,style:{padding:"24px"},children:e.jsx(a,{...r})})};var d,g,p;n.parameters={...n.parameters,docs:{...(d=n.parameters)==null?void 0:d.docs,source:{originalSource:`{
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
}`,...(p=(g=n.parameters)==null?void 0:g.docs)==null?void 0:p.source}}};var l,m,u;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
}`,...(v=(x=o.parameters)==null?void 0:x.docs)==null?void 0:v.source}}};var L,j,P;i.parameters={...i.parameters,docs:{...(L=i.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    children: "Warning Badge",
    variant: "warning"
  },
  render: (args: BadgeStoryProps) => <Badge {...args} />
}`,...(P=(j=i.parameters)==null?void 0:j.docs)==null?void 0:P.source}}};var A,f,w;c.parameters={...c.parameters,docs:{...(A=c.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    children: "Layer 1 Alert",
    variant: "alert"
  },
  render: (args: BadgeStoryProps) => <Layer layer={1} style={{
    padding: "24px"
  }}>
      <Badge {...args} />
    </Layer>
}`,...(w=(f=c.parameters)==null?void 0:f.docs)==null?void 0:w.source}}};const G=["Default","StaticAlert","StaticPrimary","StaticSuccess","StaticWarning","LayerOneAlert"];export{n as Default,c as LayerOneAlert,s as StaticAlert,t as StaticPrimary,o as StaticSuccess,i as StaticWarning,G as __namedExportsOrder,F as default};

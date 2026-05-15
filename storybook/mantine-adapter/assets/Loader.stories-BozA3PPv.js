import{j as a,$ as j}from"./iframe-alR3zAUJ.js";import{L as r}from"./Loader-DIBkbq7s.js";import"./preload-helper-Dp1pzeXC.js";import"./Loader-CK9Om4xw.js";import"./get-size-CgeYFbt0.js";import"./factory-Dof06U1Z.js";const B={title:"UI-Kit/Loader",component:r,tags:["autodocs"],parameters:{docs:{description:{component:"The Loader bridges the Recursica UI-Kit `loader` variables to the generic primitive, rendering deterministic sizes and variants visually mapped strictly from the explicit design boundary tokens."}}},argTypes:{variant:{control:"select",options:["oval","bars","dots"],description:"The structural layout variant of the loading indicator"},size:{control:"select",options:["sm","md","lg","small","default","large"],description:"Scales the dimensional and thickness layout constrained to the explicit UI variables"},color:{control:"color",description:"Optional inline dynamic color override spanning the token defaults"},layer:{control:{type:"range",min:0,max:3,step:1},description:"Applies a wrapping context to observe rendering logic externally"}}},s={args:{variant:"oval",size:"default",layer:0},render:({withLayer:t,layer:n,...e})=>a.jsx(j,{layer:n??0,style:{padding:"24px"},children:a.jsx(r,{...e})})},i={args:{variant:"oval",size:"default"},render:({withLayer:t,layer:n,...e})=>a.jsx(r,{...e})},o={args:{variant:"bars",size:"large"},render:({withLayer:t,layer:n,...e})=>a.jsx(r,{...e})},l={args:{variant:"dots",size:"sm"},render:({withLayer:t,layer:n,...e})=>a.jsx(r,{...e})},c={args:{variant:"oval",size:"default"},render:({withLayer:t,layer:n,...e})=>a.jsx(j,{layer:2,style:{padding:"24px"},children:a.jsx(r,{...e})})};var d,p,y;s.parameters={...s.parameters,docs:{...(d=s.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    variant: "oval",
    size: "default",
    layer: 0
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => <Layer layer={layer ?? 0} style={{
    padding: "24px"
  }}>
      <Loader {...args} />
    </Layer>
}`,...(y=(p=s.parameters)==null?void 0:p.docs)==null?void 0:y.source}}};var m,g,u;i.parameters={...i.parameters,docs:{...(m=i.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    variant: "oval",
    size: "default"
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => <Loader {...args} />
}`,...(u=(g=i.parameters)==null?void 0:g.docs)==null?void 0:u.source}}};var v,x,L;o.parameters={...o.parameters,docs:{...(v=o.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    variant: "bars",
    size: "large"
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => <Loader {...args} />
}`,...(L=(x=o.parameters)==null?void 0:x.docs)==null?void 0:L.source}}};var h,f,S;l.parameters={...l.parameters,docs:{...(h=l.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    variant: "dots",
    size: "sm"
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => <Loader {...args} />
}`,...(S=(f=l.parameters)==null?void 0:f.docs)==null?void 0:S.source}}};var b,w,z;c.parameters={...c.parameters,docs:{...(b=c.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    variant: "oval",
    size: "default"
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => <Layer layer={2} style={{
    padding: "24px"
  }}>
      <Loader {...args} />
    </Layer>
}`,...(z=(w=c.parameters)==null?void 0:w.docs)==null?void 0:z.source}}};const E=["Default","StaticOvalDefault","StaticBarsLarge","StaticDotsSmall","LayerTwoOval"];export{s as Default,c as LayerTwoOval,o as StaticBarsLarge,l as StaticDotsSmall,i as StaticOvalDefault,E as __namedExportsOrder,B as default};

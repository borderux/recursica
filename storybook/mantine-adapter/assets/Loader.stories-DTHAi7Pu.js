import{j as a,h as K}from"./iframe-Hqhg3Da1.js";import{L as r}from"./Loader-Dt1m2IJh.js";import"./preload-helper-Dp1pzeXC.js";import"./Loader-0CPHMGXy.js";import"./get-size-CFz4_vy9.js";import"./factory-BczmY60U.js";const H={title:"UI-Kit/Loader",component:r,tags:["autodocs"],parameters:{docs:{description:{component:"The Loader bridges the Recursica UI-Kit `loader` variables to the generic primitive, rendering deterministic sizes and variants visually mapped strictly from the explicit design boundary tokens."}}},argTypes:{variant:{control:"select",options:["oval","bars","dots"],description:"The structural layout variant of the loading indicator"},size:{control:"select",options:["sm","md","lg","small","default","large"],description:"Scales the dimensional and thickness layout constrained to the explicit UI variables"},color:{control:"color",description:"Optional inline dynamic color override spanning the token defaults"},layer:{control:{type:"range",min:0,max:3,step:1},description:"Applies a wrapping context to observe rendering logic externally"},animate:{control:"boolean",description:"Freezes the CSS animation when false — deterministic, for visual regression"}}},n={args:{variant:"oval",size:"default",layer:0},render:({withLayer:d,layer:s,...e})=>a.jsx(K,{layer:s??0,style:{padding:"24px"},children:a.jsx(r,{...e})})},t={args:{variant:"oval",size:"default",animate:!1},render:({withLayer:d,layer:s,...e})=>a.jsx(r,{...e})},i={args:{variant:"bars",size:"large",animate:!1},render:({withLayer:d,layer:s,...e})=>a.jsx(r,{...e})},o={args:{variant:"dots",size:"sm",animate:!1},render:({withLayer:d,layer:s,...e})=>a.jsx(r,{...e})},l={args:{variant:"oval",size:"default"},render:({withLayer:d,layer:s,...e})=>a.jsx(K,{layer:2,style:{padding:"24px"},children:a.jsx(r,{...e})})};var c,p,m,y,u;n.parameters={...n.parameters,docs:{...(c=n.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
}`,...(m=(p=n.parameters)==null?void 0:p.docs)==null?void 0:m.source},description:{story:"Animated — excluded from visual regression (`adapter-tester.config.json`),\nsince a moving animation diffs differently every run. See the `Static*`\nstories below for the deterministic, visual-regression-covered equivalents.",...(u=(y=n.parameters)==null?void 0:y.docs)==null?void 0:u.description}}};var g,v,f,x,h;t.parameters={...t.parameters,docs:{...(g=t.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    variant: "oval",
    size: "default",
    animate: false
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => <Loader {...args} />
}`,...(f=(v=t.parameters)==null?void 0:v.docs)==null?void 0:f.source},description:{story:"`animate: false` freezes the spin — deterministic for visual regression.",...(h=(x=t.parameters)==null?void 0:x.docs)==null?void 0:h.description}}};var L,S,b,z,w;i.parameters={...i.parameters,docs:{...(L=i.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    variant: "bars",
    size: "large",
    animate: false
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => <Loader {...args} />
}`,...(b=(S=i.parameters)==null?void 0:S.docs)==null?void 0:b.source},description:{story:"`animate: false` freezes the bars — deterministic for visual regression.",...(w=(z=i.parameters)==null?void 0:z.docs)==null?void 0:w.description}}};var j,D,O,T,k;o.parameters={...o.parameters,docs:{...(j=o.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    variant: "dots",
    size: "sm",
    animate: false
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => <Loader {...args} />
}`,...(O=(D=o.parameters)==null?void 0:D.docs)==null?void 0:O.source},description:{story:"`animate: false` freezes the dots — deterministic for visual regression.",...(k=(T=o.parameters)==null?void 0:T.docs)==null?void 0:k.description}}};var A,I,U,B,E;l.parameters={...l.parameters,docs:{...(A=l.parameters)==null?void 0:A.docs,source:{originalSource:`{
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
}`,...(U=(I=l.parameters)==null?void 0:I.docs)==null?void 0:U.source},description:{story:"Animated — excluded from visual regression, same as `Default`; this one\nadditionally demonstrates rendering inside a `layer={2}` context.",...(E=(B=l.parameters)==null?void 0:B.docs)==null?void 0:E.description}}};const J=["Default","StaticOvalDefault","StaticBarsLarge","StaticDotsSmall","LayerTwoOval"];export{n as Default,l as LayerTwoOval,i as StaticBarsLarge,o as StaticDotsSmall,t as StaticOvalDefault,J as __namedExportsOrder,H as default};

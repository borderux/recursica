import{j as e}from"./iframe-DKOvRLBH.js";import{S as r}from"./SegmentedControl-ywsXnX2D.js";import"./preload-helper-Dp1pzeXC.js";import"./get-size-C2VbC4qK.js";import"./factory-C-d_-j6C.js";import"./get-env-uyVen0u2.js";import"./to-int-PQE0s6ay.js";import"./use-merged-ref-BxkaAouo.js";import"./use-id-h3FTjRmF.js";import"./use-uncontrolled-Bnymboxj.js";const A={title:"UI-Kit/SegmentedControl",component:r,tags:["autodocs"],parameters:{docs:{description:{component:"SegmentedControl provides a linear set of two or more segments, each of which functions as a mutually exclusive button."}}},argTypes:{orientation:{control:"radio",options:["horizontal","vertical"]},fullWidth:{control:"boolean"},disabled:{control:"boolean"},data:{table:{disable:!0}},defaultChecked:{table:{disable:!0}}}},o={args:{data:["React","Angular","Vue","Svelte"],orientation:"horizontal",fullWidth:!1},render:({withLayer:t,layer:a,...n})=>e.jsx(r,{...n})},s={args:{data:["Daily","Weekly","Monthly"],fullWidth:!0},render:({withLayer:t,layer:a,...n})=>e.jsx(r,{...n})},i={args:{data:["Option 1","Option 2","Option 3"],orientation:"vertical"},render:({withLayer:t,layer:a,...n})=>e.jsx(r,{...n})},l={args:{data:["Preview","Code","Edit"],disabled:!0},render:({withLayer:t,layer:a,...n})=>e.jsx(r,{...n})},d=()=>e.jsx("svg",{viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"20 6 9 17 4 12"})}),c={args:{data:[{value:"daily",label:"Daily",icon:e.jsx(d,{})},{value:"weekly",label:"Weekly",icon:e.jsx(d,{})},{value:"monthly",label:"Monthly",icon:e.jsx(d,{})}]},render:({withLayer:t,layer:a,...n})=>e.jsx(r,{...n})};var p,u,y;o.parameters={...o.parameters,docs:{...(p=o.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    data: ["React", "Angular", "Vue", "Svelte"],
    orientation: "horizontal",
    fullWidth: false
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => {
    return <SegmentedControl {...args} />;
  }
}`,...(y=(u=o.parameters)==null?void 0:u.docs)==null?void 0:y.source}}};var m,g,h;s.parameters={...s.parameters,docs:{...(m=s.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    data: ["Daily", "Weekly", "Monthly"],
    fullWidth: true
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => {
    return <SegmentedControl {...args} />;
  }
}`,...(h=(g=s.parameters)==null?void 0:g.docs)==null?void 0:h.source}}};var x,b,v;i.parameters={...i.parameters,docs:{...(x=i.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    data: ["Option 1", "Option 2", "Option 3"],
    orientation: "vertical"
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => {
    return <SegmentedControl {...args} />;
  }
}`,...(v=(b=i.parameters)==null?void 0:b.docs)==null?void 0:v.source}}};var w,f,C;l.parameters={...l.parameters,docs:{...(w=l.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    data: ["Preview", "Code", "Edit"],
    disabled: true
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => {
    return <SegmentedControl {...args} />;
  }
}`,...(C=(f=l.parameters)==null?void 0:f.docs)==null?void 0:C.source}}};var S,k,W;c.parameters={...c.parameters,docs:{...(S=c.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    data: [{
      value: "daily",
      label: "Daily",
      icon: <CheckIcon />
    }, {
      value: "weekly",
      label: "Weekly",
      icon: <CheckIcon />
    }, {
      value: "monthly",
      label: "Monthly",
      icon: <CheckIcon />
    }]
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => {
    return <SegmentedControl {...args} />;
  }
}`,...(W=(k=c.parameters)==null?void 0:k.docs)==null?void 0:W.source}}};const F=["Default","FullWidth","Vertical","Disabled","WithIcons"];export{o as Default,l as Disabled,s as FullWidth,i as Vertical,c as WithIcons,F as __namedExportsOrder,A as default};

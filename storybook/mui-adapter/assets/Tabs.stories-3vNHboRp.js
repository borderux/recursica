import{j as r,r as L}from"./iframe-10v8QMyl.js";import{T as I,a as P,b as l,c}from"./Tabs-D9F5pTy8.js";import{F as H}from"./Flex-BZwINEH-.js";import"./preload-helper-Dp1pzeXC.js";import"./useTheme-BWphYy9m.js";import"./memoTheme-CCnXGp5I.js";import"./debounce-Be36O1Ab.js";import"./ownerWindow-HkKU3E4x.js";import"./ownerDocument-DW-IO8s5.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./useSlot-5wNbeD3S.js";import"./mergeSlotProps-Dyg-NJL-.js";import"./isHostComponent-DVu5iVWx.js";import"./useForkRef-os7NZpNf.js";import"./useSlotProps-5t6HbnbA.js";import"./useEventCallback-BJRC8zW0.js";import"./createSvgIcon-Dtd7JC7n.js";import"./ButtonBase-Al4BvGGP.js";import"./useTimeout-CTQ8vi8_.js";import"./isFocusVisible-B8k4qzLc.js";import"./getActiveElement-BwNsGdKK.js";import"./useThemeProps-C2G5_9Ay.js";import"./useThemeProps-y8YbBDzJ.js";import"./Box-BZOaFDvb.js";const or={title:"UI-Kit/Tabs",component:I,tags:["autodocs"],parameters:{layout:"centered"},argTypes:{variant:{control:"radio",options:["default","outline","pills"]},orientation:{control:"radio",options:["horizontal","vertical"]},disabled:{control:"boolean"},defaultChecked:{table:{disable:!0}}}},t=e=>{const[d,S]=L.useState("gallery"),C=(M,V)=>{S(V)};return r.jsx(H,{direction:e.orientation==="vertical"?"row":"column",style:{width:600,height:300},children:r.jsxs(P,{value:d,children:[r.jsxs(I,{value:d,onChange:C,...e,children:[r.jsx(l,{value:"gallery",label:"Gallery",disabled:e.disabled,icon:r.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",width:16,height:16,children:[r.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"2",ry:"2"}),r.jsx("circle",{cx:"8.5",cy:"8.5",r:"1.5"}),r.jsx("polyline",{points:"21 15 16 10 5 21"})]}),iconPosition:"start"}),r.jsx(l,{value:"messages",label:"Messages",disabled:e.disabled,icon:r.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",width:16,height:16,children:r.jsx("path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"})}),iconPosition:"start"}),r.jsx(l,{value:"settings",label:"Settings",disabled:e.disabled,icon:r.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",width:16,height:16,children:[r.jsx("circle",{cx:"12",cy:"12",r:"3"}),r.jsx("path",{d:"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"})]}),iconPosition:"start"})]}),r.jsx(c,{value:"gallery",children:"Gallery tab content"}),r.jsx(c,{value:"messages",children:"Messages tab content"}),r.jsx(c,{value:"settings",children:"Settings tab content"})]})})},a={render:e=>r.jsx(t,{...e}),args:{variant:"default",orientation:"horizontal"}},o={render:e=>r.jsx(t,{...e}),args:{variant:"outline",orientation:"horizontal"}},n={render:e=>r.jsx(t,{...e}),args:{variant:"pills",orientation:"horizontal"}},s={render:e=>r.jsx(t,{...e}),args:{variant:"default",orientation:"vertical"}},i={render:e=>r.jsx(t,{...e}),args:{variant:"default",orientation:"horizontal",inverted:!0}};var p,m,u;a.parameters={...a.parameters,docs:{...(p=a.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: args => <InteractiveTabs {...args} />,
  args: {
    variant: "default",
    orientation: "horizontal"
  }
}`,...(u=(m=a.parameters)==null?void 0:m.docs)==null?void 0:u.source}}};var g,h,v;o.parameters={...o.parameters,docs:{...(g=o.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: args => <InteractiveTabs {...args} />,
  args: {
    variant: "outline",
    orientation: "horizontal"
  }
}`,...(v=(h=o.parameters)==null?void 0:h.docs)==null?void 0:v.source}}};var x,b,j;n.parameters={...n.parameters,docs:{...(x=n.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: args => <InteractiveTabs {...args} />,
  args: {
    variant: "pills",
    orientation: "horizontal"
  }
}`,...(j=(b=n.parameters)==null?void 0:b.docs)==null?void 0:j.source}}};var w,f,k;s.parameters={...s.parameters,docs:{...(w=s.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: args => <InteractiveTabs {...args} />,
  args: {
    variant: "default",
    orientation: "vertical"
  }
}`,...(k=(f=s.parameters)==null?void 0:f.docs)==null?void 0:k.source}}};var y,T,z;i.parameters={...i.parameters,docs:{...(y=i.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: args => <InteractiveTabs {...args} />,
  args: {
    variant: "default",
    orientation: "horizontal",
    inverted: true
  }
}`,...(z=(T=i.parameters)==null?void 0:T.docs)==null?void 0:z.source}}};const nr=["Default","Outline","Pills","Vertical","Inverted"];export{a as Default,i as Inverted,o as Outline,n as Pills,s as Vertical,nr as __namedExportsOrder,or as default};

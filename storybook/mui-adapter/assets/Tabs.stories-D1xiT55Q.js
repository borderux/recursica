import{j as r,r as L}from"./iframe-BTksmf0I.js";import{T as z,a as P,b as l,c}from"./Tabs-BWdYlrkw.js";import{F as H}from"./Flex-C_2A1bK3.js";import"./preload-helper-Dp1pzeXC.js";import"./useTheme-Vz5Q5WHr.js";import"./styled-C6tCmiHg.js";import"./memoTheme-vMW9oVsi.js";import"./debounce-Be36O1Ab.js";import"./ownerWindow-HkKU3E4x.js";import"./ownerDocument-DW-IO8s5.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./useSlot-Csz6zqHg.js";import"./mergeSlotProps-BOiHyoQ1.js";import"./isHostComponent-DVu5iVWx.js";import"./useForkRef-Dgq5iXaA.js";import"./useSlotProps-DUff6U_n.js";import"./useEventCallback-CuwkRmbk.js";import"./createSvgIcon-DFW_rXRs.js";import"./ButtonBase-CXnJaOVv.js";import"./useTimeout-BqZDULXQ.js";import"./isFocusVisible-B8k4qzLc.js";import"./getActiveElement-BwNsGdKK.js";import"./useThemeProps-CfswcfKN.js";import"./useThemeProps-C7fA0z3Z.js";import"./Box-6ZysN7PH.js";const nr={title:"UI-Kit/Tabs",component:z,tags:["autodocs"],parameters:{layout:"centered"},argTypes:{variant:{control:"radio",options:["default","outline","pills"]},orientation:{control:"radio",options:["horizontal","vertical"]},disabled:{control:"boolean"},defaultChecked:{table:{disable:!0}}}},t=e=>{const[I,S]=L.useState("gallery"),C=(M,V)=>{S(V)};return r.jsx(H,{style:{width:600,height:300},children:r.jsxs(P,{value:I,children:[r.jsxs(z,{onChange:C,...e,children:[r.jsx(l,{value:"gallery",label:"Gallery",disabled:e.disabled,icon:r.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",width:16,height:16,children:[r.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"2",ry:"2"}),r.jsx("circle",{cx:"8.5",cy:"8.5",r:"1.5"}),r.jsx("polyline",{points:"21 15 16 10 5 21"})]}),iconPosition:"start"}),r.jsx(l,{value:"messages",label:"Messages",disabled:e.disabled,icon:r.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",width:16,height:16,children:r.jsx("path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"})}),iconPosition:"start"}),r.jsx(l,{value:"settings",label:"Settings",disabled:e.disabled,icon:r.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",width:16,height:16,children:[r.jsx("circle",{cx:"12",cy:"12",r:"3"}),r.jsx("path",{d:"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"})]}),iconPosition:"start"})]}),r.jsx(c,{value:"gallery",children:"Gallery tab content"}),r.jsx(c,{value:"messages",children:"Messages tab content"}),r.jsx(c,{value:"settings",children:"Settings tab content"})]})})},a={render:e=>r.jsx(t,{...e}),args:{variant:"default",orientation:"horizontal"}},o={render:e=>r.jsx(t,{...e}),args:{variant:"outline",orientation:"horizontal"}},n={render:e=>r.jsx(t,{...e}),args:{variant:"pills",orientation:"horizontal"}},s={render:e=>r.jsx(t,{...e}),args:{variant:"default",orientation:"vertical"}},i={render:e=>r.jsx(t,{...e}),args:{variant:"default",orientation:"horizontal",inverted:!0}};var d,p,m;a.parameters={...a.parameters,docs:{...(d=a.parameters)==null?void 0:d.docs,source:{originalSource:`{
  render: args => <InteractiveTabs {...args} />,
  args: {
    variant: "default",
    orientation: "horizontal"
  }
}`,...(m=(p=a.parameters)==null?void 0:p.docs)==null?void 0:m.source}}};var u,g,h;o.parameters={...o.parameters,docs:{...(u=o.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: args => <InteractiveTabs {...args} />,
  args: {
    variant: "outline",
    orientation: "horizontal"
  }
}`,...(h=(g=o.parameters)==null?void 0:g.docs)==null?void 0:h.source}}};var v,x,b;n.parameters={...n.parameters,docs:{...(v=n.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: args => <InteractiveTabs {...args} />,
  args: {
    variant: "pills",
    orientation: "horizontal"
  }
}`,...(b=(x=n.parameters)==null?void 0:x.docs)==null?void 0:b.source}}};var j,w,f;s.parameters={...s.parameters,docs:{...(j=s.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: args => <InteractiveTabs {...args} />,
  args: {
    variant: "default",
    orientation: "vertical"
  }
}`,...(f=(w=s.parameters)==null?void 0:w.docs)==null?void 0:f.source}}};var k,y,T;i.parameters={...i.parameters,docs:{...(k=i.parameters)==null?void 0:k.docs,source:{originalSource:`{
  render: args => <InteractiveTabs {...args} />,
  args: {
    variant: "default",
    orientation: "horizontal",
    inverted: true
  }
}`,...(T=(y=i.parameters)==null?void 0:y.docs)==null?void 0:T.source}}};const sr=["Default","Outline","Pills","Vertical","Inverted"];export{a as Default,i as Inverted,o as Outline,n as Pills,s as Vertical,sr as __namedExportsOrder,nr as default};

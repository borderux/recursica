import{j as t,r as F}from"./iframe-Dl77tjwe.js";import{S as u,a as I,b as w}from"./Stepper-CB6bNn1N.js";import{B as d}from"./Button-XLumqkZM.js";import{G as V}from"./Group-BE5JiHC_.js";import{F as E}from"./Flex-B8GVzKjI.js";import"./preload-helper-Dp1pzeXC.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./memoTheme-DvWC-XAq.js";import"./styled-BeaoawdT.js";import"./useSlot-BZ44NFKQ.js";import"./mergeSlotProps-D9EiCGal.js";import"./isHostComponent-DVu5iVWx.js";import"./useForkRef-DAouldD7.js";import"./createSvgIcon-BfZP2px1.js";import"./isMuiElement-B_9rV6Ez.js";import"./ButtonBase-B93CeWsz.js";import"./useTimeout-fPlHoj8x.js";import"./useEventCallback-B8tXGAq7.js";import"./isFocusVisible-B8k4qzLc.js";import"./Loader-YN7yFe0I.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./CircularProgress-BKEz5Z73.js";import"./Stack-s_vzK31I.js";import"./styled-Bteyqh-P.js";import"./useThemeProps-CGNC5ztO.js";import"./Box-C1Ik5mWR.js";const ae={title:"UI-Kit/Stepper",component:u,tags:["autodocs"],parameters:{layout:"centered"},argTypes:{size:{control:"radio",options:["small","large"]},orientation:{control:"radio",options:["horizontal","vertical"]}}},x=s=>{const[r,i]=F.useState(1),m=()=>i(e=>e<3?e+1:e),g=()=>i(e=>e>0?e-1:e),o=[{label:"First step",description:"Create an account and set up your billing profile"},{label:"Second step",description:"Verify email and ensure all notification preferences are correct"},{label:"Final step",description:"Get full access"}];return t.jsxs(E,{direction:"column",style:{width:600},children:[t.jsx(u,{...s,activeStep:r,children:o.map((e,a)=>t.jsx(I,{completed:r>a,children:t.jsx(w,{description:e.description,children:e.label})},a))}),r===o.length?t.jsx("div",{style:{marginTop:24,textAlign:"center"},children:"Completed, click back button to get to previous step"}):t.jsxs("div",{style:{marginTop:24,textAlign:"center"},children:["Step ",r+1," content"]}),t.jsxs(V,{mt:24,justify:"center",gap:8,children:[t.jsx(d,{variant:"outline",onClick:g,disabled:r===0,children:"Previous step"}),t.jsx(d,{variant:"outline",onClick:m,disabled:r===3,children:"Next step"})]})]})},n={render:s=>t.jsx(x,{...s}),args:{size:"large",orientation:"horizontal"}},l={render:s=>t.jsx(x,{...s}),args:{size:"small",orientation:"horizontal"}},p={render:s=>t.jsx(x,{...s}),args:{size:"large",orientation:"vertical"}},G=s=>{const[r,i]=F.useState(1),m=()=>i(e=>e<3?e+1:e),g=()=>i(e=>e>0?e-1:e),o=[{label:"This is an extremely long step title designed to test how the layout handles multiline text wrapping and constraints",description:"Create an account and set up your billing profile"},{label:"Second step",description:"Verify email and ensure all notification preferences are correct"},{label:"Final step",description:void 0}];return t.jsxs(E,{direction:"column",style:{width:600},children:[t.jsx(u,{...s,activeStep:r,children:o.map((e,a)=>t.jsx(I,{completed:r>a,children:t.jsx(w,{description:e.description,children:e.label})},a))}),r===o.length&&t.jsx("div",{style:{marginTop:24,textAlign:"center"},children:"Completed, click back button to get to previous step"}),t.jsxs(V,{mt:24,justify:"center",gap:8,children:[t.jsx(d,{variant:"outline",onClick:g,disabled:r===0,children:"Previous step"}),t.jsx(d,{variant:"outline",onClick:m,disabled:r===3,children:"Next step"})]})]})},c={render:s=>t.jsx(G,{...s}),args:{size:"large",orientation:"horizontal"}};var h,S,v;n.parameters={...n.parameters,docs:{...(h=n.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: args => <InteractiveStepper {...args} />,
  args: {
    size: "large",
    orientation: "horizontal"
  }
}`,...(v=(S=n.parameters)==null?void 0:S.docs)==null?void 0:v.source}}};var j,b,f;l.parameters={...l.parameters,docs:{...(j=l.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: args => <InteractiveStepper {...args} />,
  args: {
    size: "small",
    orientation: "horizontal"
  }
}`,...(f=(b=l.parameters)==null?void 0:b.docs)==null?void 0:f.source}}};var y,z,T;p.parameters={...p.parameters,docs:{...(y=p.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: args => <InteractiveStepper {...args} />,
  args: {
    size: "large",
    orientation: "vertical"
  }
}`,...(T=(z=p.parameters)==null?void 0:z.docs)==null?void 0:T.source}}};var k,C,A;c.parameters={...c.parameters,docs:{...(k=c.parameters)==null?void 0:k.docs,source:{originalSource:`{
  render: args => <StressTestStepper {...args} />,
  args: {
    size: "large",
    orientation: "horizontal"
  }
}`,...(A=(C=c.parameters)==null?void 0:C.docs)==null?void 0:A.source}}};const ne=["Default","Small","Vertical","LayoutStressTest"];export{n as Default,c as LayoutStressTest,l as Small,p as Vertical,ne as __namedExportsOrder,ae as default};

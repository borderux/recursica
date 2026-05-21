import{j as e,r as T}from"./iframe-DahVp6_-.js";import{S as s}from"./Stepper-CiV1x7cO.js";import{B as c}from"./Button-BMJ1S8_G.js";import{G as w}from"./Group-BlV7-r3K.js";import{F}from"./Flex-CSbGM9VY.js";import"./preload-helper-Dp1pzeXC.js";import"./get-size-aDX96fpj.js";import"./factory-D_NNwu8P.js";import"./get-auto-contrast-value-Da6zqqWm.js";import"./create-safe-context-D6805Q9h.js";import"./CheckIcon-COxmPzIn.js";import"./Loader-DvCGEUJR.js";import"./Transition-BGYkaghW.js";import"./index-B841QEH0.js";import"./index-BNvs_OV3.js";import"./use-reduced-motion-BKregIUg.js";import"./UnstyledButton-CdpaQdNN.js";import"./polymorphic-factory-CoDbakTI.js";import"./Loader-C7A4UnCQ.js";import"./Group-BxJ71Bp6.js";const X={title:"UI-Kit/Stepper",component:s,tags:["autodocs"],parameters:{layout:"centered",docs:{description:{component:"\nThe `Stepper` component provides a visual progression interface strictly mapped to Recursica's UI-Kit.\nThis component wraps Mantine's `Stepper` and natively enforces Figma tokens for sizes, colors, gaps, and states (`completed`, `current`, `upcoming`).\n\n### Layout & Orientation\nOrientation dictates how the steps flow:\n- **horizontal**: Steps render side-by-side. \n- **vertical**: Steps stack vertically, mapping seamlessly to the vertical gap tokens.\n        "}}},argTypes:{size:{control:"radio",options:["small","large"]},orientation:{control:"radio",options:["horizontal","vertical"]},defaultChecked:{table:{disable:!0}}}},u=r=>{const[o,a]=T.useState(1),d=()=>a(t=>t<3?t+1:t),m=()=>a(t=>t>0?t-1:t);return e.jsxs(F,{direction:"column",w:600,children:[e.jsxs(s,{...r,active:o,onStepClick:a,children:[e.jsx(s.Step,{label:"First step",description:"Create an account and set up your billing profile"}),e.jsx(s.Step,{label:"Second step",description:"Verify email and ensure all notification preferences are correct"}),e.jsx(s.Step,{label:"Final step",description:"Get full access"}),e.jsx(s.Completed,{children:"Completed, click back button to get to previous step"})]}),e.jsxs(w,{mt:24,justify:"center",gap:8,children:[e.jsx(c,{variant:"outline",onClick:m,disabled:o===0,children:"Previous step"}),e.jsx(c,{variant:"outline",onClick:d,disabled:o===3,children:"Next step"})]})]})},i={render:r=>e.jsx(u,{...r}),args:{size:"large",orientation:"horizontal"}},n={render:r=>e.jsx(u,{...r}),args:{size:"small",orientation:"horizontal"}},p={render:r=>e.jsx(u,{...r}),args:{size:"large",orientation:"vertical"}},I=r=>{const[o,a]=T.useState(1),d=()=>a(t=>t<3?t+1:t),m=()=>a(t=>t>0?t-1:t);return e.jsxs(F,{direction:"column",w:600,children:[e.jsxs(s,{...r,active:o,onStepClick:a,children:[e.jsx(s.Step,{label:"This is an extremely long step title designed to test how the layout handles multiline text wrapping and constraints",description:"Create an account and set up your billing profile"}),e.jsx(s.Step,{label:"Second step",description:"Verify email and ensure all notification preferences are correct"}),e.jsx(s.Step,{label:"Final step"}),e.jsx(s.Completed,{children:"Completed, click back button to get to previous step"})]}),e.jsxs(w,{mt:24,justify:"center",gap:8,children:[e.jsx(c,{variant:"outline",onClick:m,disabled:o===0,children:"Previous step"}),e.jsx(c,{variant:"outline",onClick:d,disabled:o===3,children:"Next step"})]})]})},l={render:r=>e.jsx(I,{...r}),args:{size:"large",orientation:"horizontal"}};var g,S,x;i.parameters={...i.parameters,docs:{...(g=i.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: args => <InteractiveStepper {...args} />,
  args: {
    size: "large",
    orientation: "horizontal"
  }
}`,...(x=(S=i.parameters)==null?void 0:S.docs)==null?void 0:x.source}}};var h,v,j;n.parameters={...n.parameters,docs:{...(h=n.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: args => <InteractiveStepper {...args} />,
  args: {
    size: "small",
    orientation: "horizontal"
  }
}`,...(j=(v=n.parameters)==null?void 0:v.docs)==null?void 0:j.source}}};var f,b,y;p.parameters={...p.parameters,docs:{...(f=p.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: args => <InteractiveStepper {...args} />,
  args: {
    size: "large",
    orientation: "vertical"
  }
}`,...(y=(b=p.parameters)==null?void 0:b.docs)==null?void 0:y.source}}};var z,k,C;l.parameters={...l.parameters,docs:{...(z=l.parameters)==null?void 0:z.docs,source:{originalSource:`{
  render: args => <StressTestStepper {...args} />,
  args: {
    size: "large",
    orientation: "horizontal"
  }
}`,...(C=(k=l.parameters)==null?void 0:k.docs)==null?void 0:C.source}}};const Y=["Default","Small","Vertical","LayoutStressTest"];export{i as Default,l as LayoutStressTest,n as Small,p as Vertical,Y as __namedExportsOrder,X as default};

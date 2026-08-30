import{j as t}from"./iframe-Hqhg3Da1.js";import{S as i}from"./Stack-DeKqsZ7o.js";import{B as e}from"./Button-mHh2WNZ7.js";import{T as S}from"./Text-Df8gfVCG.js";import"./preload-helper-Dp1pzeXC.js";import"./factory-BczmY60U.js";import"./get-size-CFz4_vy9.js";import"./Loader-Dt1m2IJh.js";import"./Loader-0CPHMGXy.js";import"./polymorphic-factory-CnqVX0h6.js";import"./Transition-WrigpDHF.js";import"./index-CYRVDetO.js";import"./index-OF9b6z9m.js";import"./use-reduced-motion-DOQvRuob.js";import"./UnstyledButton-Dr1Tl6DG.js";import"./Text-DUXr-bGA.js";const C={title:"UI-Kit/Stack",component:i,tags:["autodocs"],parameters:{docs:{description:{component:"Stack is a flex vertical layout container that maps directly to Mantine's Stack component allowing safe layout property passing."}}},args:{gap:"rec-default",align:"stretch",justify:"flex-start"},argTypes:{gap:{control:"select",options:["rec-none","rec-sm","rec-default","rec-md","rec-lg","rec-xl","rec-2xl","xs","sm","md","lg","xl"],description:"Gap between elements"},align:{control:"select",options:["flex-start","center","flex-end","stretch"],description:"Align-items property"},justify:{control:"select",options:["flex-start","center","flex-end","space-between","space-around"],description:"Justify-content property"},defaultChecked:{table:{disable:!0}}}},n={render:({withLayer:o,layer:c,...r})=>t.jsxs(i,{...r,children:[t.jsx(e,{variant:"solid",children:"Primary Block"}),t.jsx(e,{variant:"outline",children:"Secondary Block"}),t.jsx(S,{children:"Text element within Stack"})]})},a={args:{gap:"rec-sm"},render:({withLayer:o,layer:c,...r})=>t.jsxs(i,{...r,children:[t.jsx(e,{variant:"solid",children:"Item 1"}),t.jsx(e,{variant:"solid",children:"Item 2"}),t.jsx(e,{variant:"solid",children:"Item 3"})]})},s={args:{gap:"rec-xl"},render:({withLayer:o,layer:c,...r})=>t.jsxs(i,{...r,children:[t.jsx(e,{variant:"solid",children:"Item 1"}),t.jsx(e,{variant:"solid",children:"Item 2"}),t.jsx(e,{variant:"solid",children:"Item 3"})]})};var l,p,d;n.parameters={...n.parameters,docs:{...(l=n.parameters)==null?void 0:l.docs,source:{originalSource:`{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => <Stack {...args}>
      <Button variant="solid">Primary Block</Button>
      <Button variant="outline">Secondary Block</Button>
      <Text>Text element within Stack</Text>
    </Stack>
}`,...(d=(p=n.parameters)==null?void 0:p.docs)==null?void 0:d.source}}};var m,u,x;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    gap: "rec-sm"
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => <Stack {...args}>
      <Button variant="solid">Item 1</Button>
      <Button variant="solid">Item 2</Button>
      <Button variant="solid">Item 3</Button>
    </Stack>
}`,...(x=(u=a.parameters)==null?void 0:u.docs)==null?void 0:x.source}}};var y,g,h;s.parameters={...s.parameters,docs:{...(y=s.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    gap: "rec-xl"
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => <Stack {...args}>
      <Button variant="solid">Item 1</Button>
      <Button variant="solid">Item 2</Button>
      <Button variant="solid">Item 3</Button>
    </Stack>
}`,...(h=(g=s.parameters)==null?void 0:g.docs)==null?void 0:h.source}}};const J=["Default","StaticGapSmall","StaticGapLarge"];export{n as Default,s as StaticGapLarge,a as StaticGapSmall,J as __namedExportsOrder,C as default};

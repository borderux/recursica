import{j as t}from"./iframe-CE_LlejV.js";import{G as s}from"./Group-D0W7bnsS.js";import{B as e}from"./Button-BNDDTqeO.js";import{T as f}from"./Text-BXqT4rdP.js";import"./preload-helper-Dp1pzeXC.js";import"./Group-BOk5a3NX.js";import"./get-size-C83oZ-QB.js";import"./factory-BncmibqV.js";import"./Loader-DNOKBnPH.js";import"./Loader-CLZQpKnQ.js";import"./polymorphic-factory-C2wrZH1O.js";import"./Transition-DNjYChUw.js";import"./index-hqNk41kR.js";import"./index-B8XJbAwo.js";import"./use-reduced-motion-rzYdPTkL.js";import"./UnstyledButton-8-WhFMQf.js";import"./Text-B_aMZ33J.js";const C={title:"UI-Kit/Group",component:s,tags:["autodocs"],parameters:{docs:{description:{component:"Group is a flex horizontal layout container that maps directly to Mantine's Group component allowing safe layout property passing."}}},args:{gap:"rec-default",align:"center",justify:"flex-start",wrap:"wrap"},argTypes:{gap:{control:"select",options:["rec-none","rec-sm","rec-default","rec-md","rec-lg","rec-xl","rec-2xl","xs","sm","md","lg","xl"],description:"Gap between elements"},align:{control:"select",options:["flex-start","center","flex-end","stretch"],description:"Align-items property"},justify:{control:"select",options:["flex-start","center","flex-end","space-between","space-around"],description:"Justify-content property"},wrap:{control:"select",options:["wrap","nowrap","wrap-reverse"],description:"Flex-wrap property"},defaultChecked:{table:{disable:!0}},rowGap:{table:{disable:!0}},columnGap:{table:{disable:!0}}}},n={render:({withLayer:i,layer:l,...r})=>t.jsxs(s,{...r,children:[t.jsx(e,{variant:"solid",children:"Primary"}),t.jsx(e,{variant:"outline",children:"Secondary"}),t.jsx(f,{children:"Text element within Group"})]})},a={args:{gap:"rec-sm"},render:({withLayer:i,layer:l,...r})=>t.jsxs(s,{...r,children:[t.jsx(e,{variant:"solid",children:"Item 1"}),t.jsx(e,{variant:"solid",children:"Item 2"}),t.jsx(e,{variant:"solid",children:"Item 3"})]})},o={args:{gap:"rec-xl"},render:({withLayer:i,layer:l,...r})=>t.jsxs(s,{...r,children:[t.jsx(e,{variant:"solid",children:"Item 1"}),t.jsx(e,{variant:"solid",children:"Item 2"}),t.jsx(e,{variant:"solid",children:"Item 3"})]})};var p,c,d;n.parameters={...n.parameters,docs:{...(p=n.parameters)==null?void 0:p.docs,source:{originalSource:`{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => <Group {...args}>
      <Button variant="solid">Primary</Button>
      <Button variant="outline">Secondary</Button>
      <Text>Text element within Group</Text>
    </Group>
}`,...(d=(c=n.parameters)==null?void 0:c.docs)==null?void 0:d.source}}};var m,u,x;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    gap: "rec-sm"
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => <Group {...args}>
      <Button variant="solid">Item 1</Button>
      <Button variant="solid">Item 2</Button>
      <Button variant="solid">Item 3</Button>
    </Group>
}`,...(x=(u=a.parameters)==null?void 0:u.docs)==null?void 0:x.source}}};var y,g,h;o.parameters={...o.parameters,docs:{...(y=o.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    gap: "rec-xl"
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => <Group {...args}>
      <Button variant="solid">Item 1</Button>
      <Button variant="solid">Item 2</Button>
      <Button variant="solid">Item 3</Button>
    </Group>
}`,...(h=(g=o.parameters)==null?void 0:g.docs)==null?void 0:h.source}}};const F=["Default","StaticGapSmall","StaticGapLarge"];export{n as Default,o as StaticGapLarge,a as StaticGapSmall,F as __namedExportsOrder,C as default};

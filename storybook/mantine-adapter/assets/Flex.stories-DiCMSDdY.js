import{j as e}from"./iframe-BddUskqo.js";import{F as i}from"./Flex-DTFN2SBq.js";import{B as t}from"./Button-CEa3jSjb.js";import{T as w}from"./Text-DixFJgzJ.js";import"./preload-helper-Dp1pzeXC.js";import"./factory-CvawFnU2.js";import"./polymorphic-factory-htL0-wIS.js";import"./get-size-D6NM-3-T.js";import"./Loader-Cr3KaCVt.js";import"./Transition-vit5SB2P.js";import"./index-BBeRe09c.js";import"./index-BTPdDwiY.js";import"./use-reduced-motion-D8B25LG2.js";import"./UnstyledButton-Cpkh_G9M.js";import"./Text-CkYKvh3X.js";const D={title:"UI-Kit/Flex",component:i,tags:["autodocs"],parameters:{docs:{description:{component:"Flex is a bare-metal flex container that maps directly to Mantine's Flex component, providing unopinionated control over direction, alignment, and wrapping."}}},args:{gap:"rec-default",align:"center",justify:"flex-start",direction:"row",wrap:"wrap"},argTypes:{gap:{control:"select",options:["rec-none","rec-sm","rec-default","rec-md","rec-lg","rec-xl","rec-2xl","xs","sm","md","lg","xl"],description:"Gap between elements"},direction:{control:"select",options:["row","column","row-reverse","column-reverse"],description:"Flex-direction property"},align:{control:"select",options:["flex-start","center","flex-end","stretch"],description:"Align-items property"},justify:{control:"select",options:["flex-start","center","flex-end","space-between","space-around"],description:"Justify-content property"},wrap:{control:"select",options:["wrap","nowrap","wrap-reverse"],description:"Flex-wrap property"},defaultChecked:{table:{disable:!0}},rowGap:{table:{disable:!0}},columnGap:{table:{disable:!0}}}},n={render:({withLayer:s,layer:l,...r})=>e.jsxs(i,{...r,children:[e.jsx(t,{variant:"solid",children:"Block A"}),e.jsx(t,{variant:"outline",children:"Block B"}),e.jsx(w,{children:"Text inside Flex"})]})},a={args:{gap:"rec-sm",direction:"column"},render:({withLayer:s,layer:l,...r})=>e.jsxs(i,{...r,children:[e.jsx(t,{variant:"solid",children:"Item 1"}),e.jsx(t,{variant:"solid",children:"Item 2"}),e.jsx(t,{variant:"solid",children:"Item 3"})]})},o={args:{gap:"rec-xl",direction:"row"},render:({withLayer:s,layer:l,...r})=>e.jsxs(i,{...r,children:[e.jsx(t,{variant:"solid",children:"Item 1"}),e.jsx(t,{variant:"solid",children:"Item 2"}),e.jsx(t,{variant:"solid",children:"Item 3"})]})};var c,p,d;n.parameters={...n.parameters,docs:{...(c=n.parameters)==null?void 0:c.docs,source:{originalSource:`{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => <Flex {...args}>
      <Button variant="solid">Block A</Button>
      <Button variant="outline">Block B</Button>
      <Text>Text inside Flex</Text>
    </Flex>
}`,...(d=(p=n.parameters)==null?void 0:p.docs)==null?void 0:d.source}}};var m,u,x;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    gap: "rec-sm",
    direction: "column"
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => <Flex {...args}>
      <Button variant="solid">Item 1</Button>
      <Button variant="solid">Item 2</Button>
      <Button variant="solid">Item 3</Button>
    </Flex>
}`,...(x=(u=a.parameters)==null?void 0:u.docs)==null?void 0:x.source}}};var y,g,v;o.parameters={...o.parameters,docs:{...(y=o.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    gap: "rec-xl",
    direction: "row"
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => <Flex {...args}>
      <Button variant="solid">Item 1</Button>
      <Button variant="solid">Item 2</Button>
      <Button variant="solid">Item 3</Button>
    </Flex>
}`,...(v=(g=o.parameters)==null?void 0:g.docs)==null?void 0:v.source}}};const E=["Default","StaticGapSmallColumn","StaticGapLargeRow"];export{n as Default,o as StaticGapLargeRow,a as StaticGapSmallColumn,E as __namedExportsOrder,D as default};

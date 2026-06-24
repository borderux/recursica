import{j as e}from"./iframe-ET1O9uy4.js";import{F as a}from"./Flex-B4r7Kh8X.js";import{B as t}from"./Button-DH9qCRmG.js";import{T as w}from"./Text-BiD1-xnZ.js";import"./preload-helper-Dp1pzeXC.js";import"./Box-BZhSCVxa.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./Loader-DCApF8Dt.js";import"./styled-NHfFC7RQ.js";import"./memoTheme-DivAIOBF.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./ButtonBase-BtEGHIx2.js";import"./useTimeout-CGMOaySK.js";import"./useForkRef-B2D9i2iU.js";import"./useEventCallback-B29ZYna7.js";import"./isFocusVisible-B8k4qzLc.js";import"./CircularProgress-BAlDSXG8.js";import"./Typography-BHhSeesA.js";import"./Typography-BAZytbpX.js";const K={title:"UI-Kit/Flex",component:a,tags:["autodocs"],parameters:{docs:{description:{component:"Flex is a bare-metal flex container that maps directly to Mantine's Flex component, providing unopinionated control over direction, alignment, and wrapping."}}},args:{gap:"rec-default",align:"center",justify:"flex-start",direction:"row",wrap:"wrap"},argTypes:{gap:{control:"select",options:["rec-none","rec-sm","rec-default","rec-md","rec-lg","rec-xl","rec-2xl","xs","sm","md","lg","xl"],description:"Gap between elements"},direction:{control:"select",options:["row","column","row-reverse","column-reverse"],description:"Flex-direction property"},align:{control:"select",options:["flex-start","center","flex-end","stretch"],description:"Align-items property"},justify:{control:"select",options:["flex-start","center","flex-end","space-between","space-around"],description:"Justify-content property"},wrap:{control:"select",options:["wrap","nowrap","wrap-reverse"],description:"Flex-wrap property"},defaultChecked:{table:{disable:!0}},rowGap:{table:{disable:!0}},columnGap:{table:{disable:!0}}}},n={render:({withLayer:s,layer:l,...r})=>e.jsxs(a,{...r,children:[e.jsx(t,{variant:"solid",children:"Block A"}),e.jsx(t,{variant:"outline",children:"Block B"}),e.jsx(w,{children:"Text inside Flex"})]})},o={args:{gap:"rec-sm",direction:"column"},render:({withLayer:s,layer:l,...r})=>e.jsxs(a,{...r,children:[e.jsx(t,{variant:"solid",children:"Item 1"}),e.jsx(t,{variant:"solid",children:"Item 2"}),e.jsx(t,{variant:"solid",children:"Item 3"})]})},i={args:{gap:"rec-xl",direction:"row"},render:({withLayer:s,layer:l,...r})=>e.jsxs(a,{...r,children:[e.jsx(t,{variant:"solid",children:"Item 1"}),e.jsx(t,{variant:"solid",children:"Item 2"}),e.jsx(t,{variant:"solid",children:"Item 3"})]})};var c,p,d;n.parameters={...n.parameters,docs:{...(c=n.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
}`,...(d=(p=n.parameters)==null?void 0:p.docs)==null?void 0:d.source}}};var m,u,x;o.parameters={...o.parameters,docs:{...(m=o.parameters)==null?void 0:m.docs,source:{originalSource:`{
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
}`,...(x=(u=o.parameters)==null?void 0:u.docs)==null?void 0:x.source}}};var y,g,v;i.parameters={...i.parameters,docs:{...(y=i.parameters)==null?void 0:y.docs,source:{originalSource:`{
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
}`,...(v=(g=i.parameters)==null?void 0:g.docs)==null?void 0:v.source}}};const M=["Default","StaticGapSmallColumn","StaticGapLargeRow"];export{n as Default,i as StaticGapLargeRow,o as StaticGapSmallColumn,M as __namedExportsOrder,K as default};

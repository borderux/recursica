import{j as e}from"./iframe-wfJiKc8C.js";import{F as i}from"./Flex-BU7ng9IZ.js";import{B as t}from"./Button-BX3zeU7H.js";import{T as w}from"./Text-BKm1KGp1.js";import"./preload-helper-Dp1pzeXC.js";import"./memoTheme-iVEvjh8n.js";import"./Loader-BM4__DSu.js";import"./Button-jSPbgPfa.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./ButtonBase-Dj6rRb9P.js";import"./useTimeout-BM-ogh58.js";import"./useForkRef-DibPUPK5.js";import"./useEventCallback-CHP4WYYC.js";import"./isFocusVisible-B8k4qzLc.js";import"./CircularProgress-DxN5TrBK.js";import"./Typography-C2vuKXfB.js";import"./Typography-CDtn7TZW.js";const _={title:"UI-Kit/Flex",component:i,tags:["autodocs"],parameters:{docs:{description:{component:"Flex is a bare-metal flex container that maps directly to Mantine's Flex component, providing unopinionated control over direction, alignment, and wrapping."}}},args:{gap:"rec-default",align:"center",justify:"flex-start",direction:"row",wrap:"wrap"},argTypes:{gap:{control:"select",options:["rec-none","rec-sm","rec-default","rec-md","rec-lg","rec-xl","rec-2xl","xs","sm","md","lg","xl"],description:"Gap between elements"},direction:{control:"select",options:["row","column","row-reverse","column-reverse"],description:"Flex-direction property"},align:{control:"select",options:["flex-start","center","flex-end","stretch"],description:"Align-items property"},justify:{control:"select",options:["flex-start","center","flex-end","space-between","space-around"],description:"Justify-content property"},wrap:{control:"select",options:["wrap","nowrap","wrap-reverse"],description:"Flex-wrap property"},defaultChecked:{table:{disable:!0}},rowGap:{table:{disable:!0}},columnGap:{table:{disable:!0}}}},n={render:({withLayer:s,layer:l,...r})=>e.jsxs(i,{...r,children:[e.jsx(t,{variant:"solid",children:"Block A"}),e.jsx(t,{variant:"outline",children:"Block B"}),e.jsx(w,{children:"Text inside Flex"})]})},o={args:{gap:"rec-sm",direction:"column"},render:({withLayer:s,layer:l,...r})=>e.jsxs(i,{...r,children:[e.jsx(t,{variant:"solid",children:"Item 1"}),e.jsx(t,{variant:"solid",children:"Item 2"}),e.jsx(t,{variant:"solid",children:"Item 3"})]})},a={args:{gap:"rec-xl",direction:"row"},render:({withLayer:s,layer:l,...r})=>e.jsxs(i,{...r,children:[e.jsx(t,{variant:"solid",children:"Item 1"}),e.jsx(t,{variant:"solid",children:"Item 2"}),e.jsx(t,{variant:"solid",children:"Item 3"})]})};var c,p,d;n.parameters={...n.parameters,docs:{...(c=n.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
}`,...(x=(u=o.parameters)==null?void 0:u.docs)==null?void 0:x.source}}};var y,g,v;a.parameters={...a.parameters,docs:{...(y=a.parameters)==null?void 0:y.docs,source:{originalSource:`{
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
}`,...(v=(g=a.parameters)==null?void 0:g.docs)==null?void 0:v.source}}};const J=["Default","StaticGapSmallColumn","StaticGapLargeRow"];export{n as Default,a as StaticGapLargeRow,o as StaticGapSmallColumn,J as __namedExportsOrder,_ as default};

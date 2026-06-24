import{j as t}from"./iframe-ET1O9uy4.js";import{S as s}from"./Stack-DXRMFBL5.js";import{B as e}from"./Button-DH9qCRmG.js";import{T as S}from"./Text-BiD1-xnZ.js";import"./preload-helper-Dp1pzeXC.js";import"./Stack-BUEuP2nA.js";import"./styled-NHfFC7RQ.js";import"./styled-Bq2TYJRz.js";import"./useThemeProps-CMdwUTLA.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./Loader-DCApF8Dt.js";import"./memoTheme-DivAIOBF.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./ButtonBase-BtEGHIx2.js";import"./useTimeout-CGMOaySK.js";import"./useForkRef-B2D9i2iU.js";import"./useEventCallback-B29ZYna7.js";import"./isFocusVisible-B8k4qzLc.js";import"./CircularProgress-BAlDSXG8.js";import"./Typography-BHhSeesA.js";import"./Typography-BAZytbpX.js";const R={title:"UI-Kit/Stack",component:s,tags:["autodocs"],parameters:{docs:{description:{component:"Stack is a flex vertical layout container that maps directly to Mantine's Stack component allowing safe layout property passing."}}},args:{gap:"rec-default",align:"stretch",justify:"flex-start"},argTypes:{gap:{control:"select",options:["rec-none","rec-sm","rec-default","rec-md","rec-lg","rec-xl","rec-2xl","xs","sm","md","lg","xl"],description:"Gap between elements"},align:{control:"select",options:["flex-start","center","flex-end","stretch"],description:"Align-items property"},justify:{control:"select",options:["flex-start","center","flex-end","space-between","space-around"],description:"Justify-content property"},defaultChecked:{table:{disable:!0}}}},n={render:({withLayer:o,layer:c,...r})=>t.jsxs(s,{...r,children:[t.jsx(e,{variant:"solid",children:"Primary Block"}),t.jsx(e,{variant:"outline",children:"Secondary Block"}),t.jsx(S,{children:"Text element within Stack"})]})},a={args:{gap:"rec-sm"},render:({withLayer:o,layer:c,...r})=>t.jsxs(s,{...r,children:[t.jsx(e,{variant:"solid",children:"Item 1"}),t.jsx(e,{variant:"solid",children:"Item 2"}),t.jsx(e,{variant:"solid",children:"Item 3"})]})},i={args:{gap:"rec-xl"},render:({withLayer:o,layer:c,...r})=>t.jsxs(s,{...r,children:[t.jsx(e,{variant:"solid",children:"Item 1"}),t.jsx(e,{variant:"solid",children:"Item 2"}),t.jsx(e,{variant:"solid",children:"Item 3"})]})};var l,p,m;n.parameters={...n.parameters,docs:{...(l=n.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
}`,...(m=(p=n.parameters)==null?void 0:p.docs)==null?void 0:m.source}}};var d,u,x;a.parameters={...a.parameters,docs:{...(d=a.parameters)==null?void 0:d.docs,source:{originalSource:`{
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
}`,...(x=(u=a.parameters)==null?void 0:u.docs)==null?void 0:x.source}}};var y,g,h;i.parameters={...i.parameters,docs:{...(y=i.parameters)==null?void 0:y.docs,source:{originalSource:`{
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
}`,...(h=(g=i.parameters)==null?void 0:g.docs)==null?void 0:h.source}}};const U=["Default","StaticGapSmall","StaticGapLarge"];export{n as Default,i as StaticGapLarge,a as StaticGapSmall,U as __namedExportsOrder,R as default};

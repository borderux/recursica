import{j as t}from"./iframe-wfJiKc8C.js";import{S as i}from"./Stack-CEXaTMeU.js";import{B as e}from"./Button-BX3zeU7H.js";import{T as h}from"./Text-BKm1KGp1.js";import"./preload-helper-Dp1pzeXC.js";import"./Stack-R4gWixDy.js";import"./memoTheme-iVEvjh8n.js";import"./styled-PE4cu9RO.js";import"./useThemeProps-Bi-7RA3K.js";import"./Loader-BM4__DSu.js";import"./Button-jSPbgPfa.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./ButtonBase-Dj6rRb9P.js";import"./useTimeout-BM-ogh58.js";import"./useForkRef-DibPUPK5.js";import"./useEventCallback-CHP4WYYC.js";import"./isFocusVisible-B8k4qzLc.js";import"./CircularProgress-DxN5TrBK.js";import"./Typography-C2vuKXfB.js";import"./Typography-CDtn7TZW.js";const O={title:"UI-Kit/Stack",component:i,tags:["autodocs"],parameters:{docs:{description:{component:"Stack is a flex vertical layout container that maps directly to Mantine's Stack component allowing safe layout property passing."}}},args:{spacing:"rec-default",alignItems:"stretch",justifyContent:"flex-start"},argTypes:{spacing:{control:"select",options:["rec-none","rec-sm","rec-default","rec-md","rec-lg","rec-xl","rec-2xl","xs","sm","md","lg","xl"],description:"Space between elements"},alignItems:{control:"select",options:["flex-start","center","flex-end","stretch"],description:"Align-items property"},justifyContent:{control:"select",options:["flex-start","center","flex-end","space-between","space-around"],description:"Justify-content property"},defaultChecked:{table:{disable:!0}}}},r={render:({withLayer:o,layer:c,...n})=>t.jsxs(i,{...n,children:[t.jsx(e,{variant:"solid",children:"Primary Block"}),t.jsx(e,{variant:"outline",children:"Secondary Block"}),t.jsx(h,{children:"Text element within Stack"})]})},a={args:{spacing:"rec-sm"},render:({withLayer:o,layer:c,...n})=>t.jsxs(i,{...n,children:[t.jsx(e,{variant:"solid",children:"Item 1"}),t.jsx(e,{variant:"solid",children:"Item 2"}),t.jsx(e,{variant:"solid",children:"Item 3"})]})},s={args:{spacing:"rec-xl"},render:({withLayer:o,layer:c,...n})=>t.jsxs(i,{...n,children:[t.jsx(e,{variant:"solid",children:"Item 1"}),t.jsx(e,{variant:"solid",children:"Item 2"}),t.jsx(e,{variant:"solid",children:"Item 3"})]})};var l,p,m;r.parameters={...r.parameters,docs:{...(l=r.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
}`,...(m=(p=r.parameters)==null?void 0:p.docs)==null?void 0:m.source}}};var d,u,x;a.parameters={...a.parameters,docs:{...(d=a.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    spacing: "rec-sm"
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
}`,...(x=(u=a.parameters)==null?void 0:u.docs)==null?void 0:x.source}}};var y,g,S;s.parameters={...s.parameters,docs:{...(y=s.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    spacing: "rec-xl"
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
}`,...(S=(g=s.parameters)==null?void 0:g.docs)==null?void 0:S.source}}};const R=["Default","StaticGapSmall","StaticGapLarge"];export{r as Default,s as StaticGapLarge,a as StaticGapSmall,R as __namedExportsOrder,O as default};

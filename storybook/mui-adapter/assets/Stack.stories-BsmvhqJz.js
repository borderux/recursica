import{j as t}from"./iframe-C_ymJL69.js";import{S as s}from"./Stack-DxL-lmgc.js";import{B as e}from"./Button-DnD2hiLS.js";import{T as S}from"./Text-DX1OY5C-.js";import"./preload-helper-Dp1pzeXC.js";import"./Stack-Dc0WGKLz.js";import"./styled-CVDphjR5.js";import"./styled-B3QdT3qF.js";import"./useThemeProps-RaAAXeEo.js";import"./generateUtilityClass-BtcU_pBl.js";import"./Loader-DMsNTjGZ.js";import"./memoTheme-DuK-uO2q.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./generateUtilityClasses-DDbjFgb8.js";import"./ButtonBase-BMpcVYGR.js";import"./useTimeout-0m_RpfT3.js";import"./useForkRef-BlrSiLQa.js";import"./useEventCallback-guZE-voT.js";import"./isFocusVisible-B8k4qzLc.js";import"./CircularProgress-DHBJemG1.js";import"./Typography-m9pV2k3Z.js";import"./Typography-B__wrBSG.js";const R={title:"UI-Kit/Stack",component:s,tags:["autodocs"],parameters:{docs:{description:{component:"Stack is a flex vertical layout container that maps directly to Mantine's Stack component allowing safe layout property passing."}},controls:{include:["layer","withLayer","gap","alignItems","justifyContent","defaultChecked","children","component","variant","size","icon","disabled","href","onClick","onChange","value","checked"]}},args:{gap:"rec-default",alignItems:"stretch",justifyContent:"flex-start"},argTypes:{gap:{control:"select",options:["rec-none","rec-sm","rec-default","rec-md","rec-lg","rec-xl","rec-2xl","xs","sm","md","lg","xl"],description:"Gap between elements"},alignItems:{control:"select",options:["flex-start","center","flex-end","stretch"],description:"Align-items property"},justifyContent:{control:"select",options:["flex-start","center","flex-end","space-between","space-around"],description:"Justify-content property"},defaultChecked:{table:{disable:!0}}}},n={render:({withLayer:o,layer:c,...r})=>t.jsxs(s,{...r,children:[t.jsx(e,{variant:"solid",children:"Primary Block"}),t.jsx(e,{variant:"outline",children:"Secondary Block"}),t.jsx(S,{children:"Text element within Stack"})]})},a={args:{gap:"rec-sm"},render:({withLayer:o,layer:c,...r})=>t.jsxs(s,{...r,children:[t.jsx(e,{variant:"solid",children:"Item 1"}),t.jsx(e,{variant:"solid",children:"Item 2"}),t.jsx(e,{variant:"solid",children:"Item 3"})]})},i={args:{gap:"rec-xl"},render:({withLayer:o,layer:c,...r})=>t.jsxs(s,{...r,children:[t.jsx(e,{variant:"solid",children:"Item 1"}),t.jsx(e,{variant:"solid",children:"Item 2"}),t.jsx(e,{variant:"solid",children:"Item 3"})]})};var l,p,d;n.parameters={...n.parameters,docs:{...(l=n.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
}`,...(d=(p=n.parameters)==null?void 0:p.docs)==null?void 0:d.source}}};var m,u,y;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`{
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
}`,...(y=(u=a.parameters)==null?void 0:u.docs)==null?void 0:y.source}}};var x,g,h;i.parameters={...i.parameters,docs:{...(x=i.parameters)==null?void 0:x.docs,source:{originalSource:`{
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

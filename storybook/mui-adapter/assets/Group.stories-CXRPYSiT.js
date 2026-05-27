import{j as e}from"./iframe-C_ymJL69.js";import{G as i}from"./Group-Dt9NXSuA.js";import{B as t}from"./Button-DnD2hiLS.js";import{T as f}from"./Text-DX1OY5C-.js";import"./preload-helper-Dp1pzeXC.js";import"./Stack-Dc0WGKLz.js";import"./styled-CVDphjR5.js";import"./styled-B3QdT3qF.js";import"./useThemeProps-RaAAXeEo.js";import"./generateUtilityClass-BtcU_pBl.js";import"./Loader-DMsNTjGZ.js";import"./memoTheme-DuK-uO2q.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./generateUtilityClasses-DDbjFgb8.js";import"./ButtonBase-BMpcVYGR.js";import"./useTimeout-0m_RpfT3.js";import"./useForkRef-BlrSiLQa.js";import"./useEventCallback-guZE-voT.js";import"./isFocusVisible-B8k4qzLc.js";import"./CircularProgress-DHBJemG1.js";import"./Typography-m9pV2k3Z.js";import"./Typography-B__wrBSG.js";const M={title:"UI-Kit/Group",component:i,tags:["autodocs"],parameters:{docs:{description:{component:"Group is a flex horizontal layout container that maps directly to Mantine's Group component allowing safe layout property passing."}},controls:{include:["layer","withLayer","gap","alignItems","justifyContent","flexWrap","defaultChecked","rowGap","columnGap","children","component","variant","size","icon","disabled","href","onClick","onChange","value","checked"]}},args:{gap:"rec-default",alignItems:"center",justifyContent:"flex-start",flexWrap:"wrap"},argTypes:{gap:{control:"select",options:["rec-none","rec-sm","rec-default","rec-md","rec-lg","rec-xl","rec-2xl","xs","sm","md","lg","xl"],description:"Gap between elements"},alignItems:{control:"select",options:["flex-start","center","flex-end","stretch"],description:"Align-items property"},justifyContent:{control:"select",options:["flex-start","center","flex-end","space-between","space-around"],description:"Justify-content property"},flexWrap:{control:"select",options:["wrap","nowrap","wrap-reverse"],description:"Flex-wrap property"},defaultChecked:{table:{disable:!0}},rowGap:{table:{disable:!0}},columnGap:{table:{disable:!0}}}},n={render:({withLayer:s,layer:l,...r})=>e.jsxs(i,{...r,children:[e.jsx(t,{variant:"solid",children:"Primary"}),e.jsx(t,{variant:"outline",children:"Secondary"}),e.jsx(f,{children:"Text element within Group"})]})},a={args:{gap:"rec-sm"},render:({withLayer:s,layer:l,...r})=>e.jsxs(i,{...r,children:[e.jsx(t,{variant:"solid",children:"Item 1"}),e.jsx(t,{variant:"solid",children:"Item 2"}),e.jsx(t,{variant:"solid",children:"Item 3"})]})},o={args:{gap:"rec-xl"},render:({withLayer:s,layer:l,...r})=>e.jsxs(i,{...r,children:[e.jsx(t,{variant:"solid",children:"Item 1"}),e.jsx(t,{variant:"solid",children:"Item 2"}),e.jsx(t,{variant:"solid",children:"Item 3"})]})};var p,c,d;n.parameters={...n.parameters,docs:{...(p=n.parameters)==null?void 0:p.docs,source:{originalSource:`{
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
}`,...(h=(g=o.parameters)==null?void 0:g.docs)==null?void 0:h.source}}};const O=["Default","StaticGapSmall","StaticGapLarge"];export{n as Default,o as StaticGapLarge,a as StaticGapSmall,O as __namedExportsOrder,M as default};

import{j as t}from"./iframe-BM_dDOh_.js";import{S as i}from"./Stack-C6hXKwRk.js";import{B as e}from"./Button-hm9JUfNM.js";import{T as S}from"./Text-mf_EOseU.js";import"./preload-helper-Dp1pzeXC.js";import"./Stack-Di7Lgzd_.js";import"./styled-CnBO-sP5.js";import"./useThemeProps-DVuDsqVq.js";import"./generateUtilityClass-BtcU_pBl.js";import"./Loader-Bh2fmZbz.js";import"./createSimplePaletteValueFilter-BA9MTTuY.js";import"./generateUtilityClasses-DDbjFgb8.js";import"./isFocusVisible-B8k4qzLc.js";import"./Typography-BFG9IfAb.js";const P={title:"UI-Kit/Stack",component:i,tags:["autodocs"],parameters:{docs:{description:{component:"Stack is a flex vertical layout container that maps directly to Mantine's Stack component allowing safe layout property passing."}},controls:{include:["layer","withLayer","gap","alignItems","justifyContent","defaultChecked","children","component","variant","size","icon","disabled","href","onClick","onChange","value","checked"]}},args:{gap:"rec-default",alignItems:"stretch",justifyContent:"flex-start"},argTypes:{gap:{control:"select",options:["rec-none","rec-sm","rec-default","rec-md","rec-lg","rec-xl","rec-2xl","xs","sm","md","lg","xl"],description:"Gap between elements"},alignItems:{control:"select",options:["flex-start","center","flex-end","stretch"],description:"Align-items property"},justifyContent:{control:"select",options:["flex-start","center","flex-end","space-between","space-around"],description:"Justify-content property"},defaultChecked:{table:{disable:!0}}}},r={render:({withLayer:o,layer:c,...n})=>t.jsxs(i,{...n,children:[t.jsx(e,{variant:"solid",children:"Primary Block"}),t.jsx(e,{variant:"outline",children:"Secondary Block"}),t.jsx(S,{children:"Text element within Stack"})]})},a={args:{gap:"rec-sm"},render:({withLayer:o,layer:c,...n})=>t.jsxs(i,{...n,children:[t.jsx(e,{variant:"solid",children:"Item 1"}),t.jsx(e,{variant:"solid",children:"Item 2"}),t.jsx(e,{variant:"solid",children:"Item 3"})]})},s={args:{gap:"rec-xl"},render:({withLayer:o,layer:c,...n})=>t.jsxs(i,{...n,children:[t.jsx(e,{variant:"solid",children:"Item 1"}),t.jsx(e,{variant:"solid",children:"Item 2"}),t.jsx(e,{variant:"solid",children:"Item 3"})]})};var l,p,d;r.parameters={...r.parameters,docs:{...(l=r.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
}`,...(d=(p=r.parameters)==null?void 0:p.docs)==null?void 0:d.source}}};var m,u,y;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`{
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
}`,...(y=(u=a.parameters)==null?void 0:u.docs)==null?void 0:y.source}}};var x,g,h;s.parameters={...s.parameters,docs:{...(x=s.parameters)==null?void 0:x.docs,source:{originalSource:`{
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
}`,...(h=(g=s.parameters)==null?void 0:g.docs)==null?void 0:h.source}}};const _=["Default","StaticGapSmall","StaticGapLarge"];export{r as Default,s as StaticGapLarge,a as StaticGapSmall,_ as __namedExportsOrder,P as default};

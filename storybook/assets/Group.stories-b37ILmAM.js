import{r as P,f as L,j as e}from"./iframe-BlyjOLeZ.js";import{G as R}from"./Group-CFyh16uX.js";import{B as r}from"./Button-BCD_j59f.js";import{T}from"./Text-CcEYh7RF.js";import"./preload-helper-Dp1pzeXC.js";import"./get-size-AZBW9FMn.js";import"./factory-DLKEpXnh.js";import"./polymorphic-factory-CAKH0E_l.js";import"./Loader-CG0knn21.js";import"./Transition-Bar4Phoa.js";import"./index-B7PH_peB.js";import"./index-DJkV7rdH.js";import"./use-reduced-motion-DlBLUqd4.js";import"./UnstyledButton-cwPISIpE.js";import"./Text-0sJAhae3.js";const A="Group-module__root___ftO64",n={root:A},a=P.forwardRef(function({children:s,overStyled:t=!1,gap:_="rec-default",...b},S){const u=L({...b,gap:_},t),d=u,m={root:n.root},i=d.classNames;if(i&&typeof i=="object"&&!Array.isArray(i)){const f=i;m.root=f.root?`${n.root} ${f.root}`:n.root}const y=d.className,I=y?`${n.root} ${y}`:n.root;return e.jsx(R,{ref:S,className:I,classNames:m,...u,children:s})});a.displayName="Group";try{a.displayName="Group",a.__docgenInfo={description:"",displayName:"Group",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Group/Group.tsx",methods:[],props:{defaultChecked:{defaultValue:null,declarations:[{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"},{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"}],description:"",name:"defaultChecked",parent:{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"},required:!1,tags:{},type:{name:"boolean | undefined"}},rowGap:{defaultValue:null,declarations:[{fileName:"mantine-adapter/src/components/Group/Group.tsx",name:"RecursicaGroupProps"},{fileName:"mantine-adapter/src/components/Group/Group.tsx",name:"RecursicaGroupProps"}],description:"",name:"rowGap",parent:{fileName:"mantine-adapter/src/components/Group/Group.tsx",name:"RecursicaGroupProps"},required:!1,tags:{},type:{name:"MantineSpacing | RecursicaSpacing | undefined"}},columnGap:{defaultValue:null,declarations:[{fileName:"mantine-adapter/src/components/Group/Group.tsx",name:"RecursicaGroupProps"},{fileName:"mantine-adapter/src/components/Group/Group.tsx",name:"RecursicaGroupProps"}],description:"",name:"columnGap",parent:{fileName:"mantine-adapter/src/components/Group/Group.tsx",name:"RecursicaGroupProps"},required:!1,tags:{},type:{name:"MantineSpacing | RecursicaSpacing | undefined"}}},tags:{}}}catch{}const Q={title:"UI-Kit/Group",component:a,tags:["autodocs"],parameters:{docs:{description:{component:"Group is a flex horizontal layout container that maps directly to Mantine's Group component allowing safe layout property passing."}}},args:{gap:"rec-default",align:"center",justify:"flex-start",wrap:"wrap"},argTypes:{gap:{control:"select",options:["rec-none","rec-sm","rec-default","rec-md","rec-lg","rec-xl","rec-2xl","xs","sm","md","lg","xl"],description:"Gap between elements"},align:{control:"select",options:["flex-start","center","flex-end","stretch"],description:"Align-items property"},justify:{control:"select",options:["flex-start","center","flex-end","space-between","space-around"],description:"Justify-content property"},wrap:{control:"select",options:["wrap","nowrap","wrap-reverse"],description:"Flex-wrap property"},defaultChecked:{table:{disable:!0}},rowGap:{table:{disable:!0}},columnGap:{table:{disable:!0}}}},p={render:({withLayer:o,layer:s,...t})=>e.jsxs(a,{...t,children:[e.jsx(r,{variant:"solid",children:"Primary"}),e.jsx(r,{variant:"outline",children:"Secondary"}),e.jsx(T,{children:"Text element within Group"})]})},c={args:{gap:"rec-sm"},render:({withLayer:o,layer:s,...t})=>e.jsxs(a,{...t,children:[e.jsx(r,{variant:"solid",children:"Item 1"}),e.jsx(r,{variant:"solid",children:"Item 2"}),e.jsx(r,{variant:"solid",children:"Item 3"})]})},l={args:{gap:"rec-xl"},render:({withLayer:o,layer:s,...t})=>e.jsxs(a,{...t,children:[e.jsx(r,{variant:"solid",children:"Item 1"}),e.jsx(r,{variant:"solid",children:"Item 2"}),e.jsx(r,{variant:"solid",children:"Item 3"})]})};var x,G,g;p.parameters={...p.parameters,docs:{...(x=p.parameters)==null?void 0:x.docs,source:{originalSource:`{
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
}`,...(g=(G=p.parameters)==null?void 0:G.docs)==null?void 0:g.source}}};var h,w,v;c.parameters={...c.parameters,docs:{...(h=c.parameters)==null?void 0:h.docs,source:{originalSource:`{
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
}`,...(v=(w=c.parameters)==null?void 0:w.docs)==null?void 0:v.source}}};var N,j,B;l.parameters={...l.parameters,docs:{...(N=l.parameters)==null?void 0:N.docs,source:{originalSource:`{
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
}`,...(B=(j=l.parameters)==null?void 0:j.docs)==null?void 0:B.source}}};const W=["Default","StaticGapSmall","StaticGapLarge"];export{p as Default,l as StaticGapLarge,c as StaticGapSmall,W as __namedExportsOrder,Q as default};

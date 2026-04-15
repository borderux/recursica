import{j as t,r as L,f as R}from"./iframe-d8_mgu_F.js";import{e as $}from"./get-size-J7CBMG80.js";import{f as M,u as E,b as H,B as D,c as U}from"./factory-BnxMGGpV.js";import{B as a}from"./Button-CYYANUBS.js";import{T as V}from"./Text-Bt36CO3M.js";import"./preload-helper-Dp1pzeXC.js";import"./polymorphic-factory-D_h49hYh.js";import"./Transition-CjqzxG3M.js";import"./index-vaX_qTck.js";import"./index-Cqv26_ew.js";import"./use-reduced-motion-CjtJf-wE.js";import"./UnstyledButton-BAqRjZ2G.js";import"./Text-D5Ei7a1m.js";var w={root:"m_6d731127"};const q={gap:"md",align:"stretch",justify:"flex-start"},z=U((e,{gap:o,align:s,justify:n})=>({root:{"--stack-gap":$(o),"--stack-align":s,"--stack-justify":n}})),k=M((e,o)=>{const s=E("Stack",q,e),{classNames:n,className:x,style:y,styles:l,unstyled:d,vars:m,align:c,justify:S,gap:h,variant:p,attributes:A,...C}=s,G=H({name:"Stack",props:s,classes:w,className:x,style:y,classNames:n,styles:l,unstyled:d,attributes:A,vars:m,varsResolver:z});return t.jsx(D,{ref:o,...G("root"),variant:p,...C})});k.classes=w;k.displayName="@mantine/core/Stack";const J="Stack-module__root___NUN-x",i={root:J},r=L.forwardRef(function({children:o,overStyled:s=!1,gap:n="rec-default",...x},y){const l=R({...x,gap:n},s),d=l,m={root:i.root},c=d.classNames;if(c&&typeof c=="object"&&!Array.isArray(c)){const p=c;m.root=p.root?`${i.root} ${p.root}`:i.root}const S=d.className,h=S?`${i.root} ${S}`:i.root;return t.jsx(k,{ref:y,className:h,classNames:m,...l,children:o})});r.displayName="Stack";try{r.displayName="Stack",r.__docgenInfo={description:"",displayName:"Stack",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Stack/Stack.tsx",methods:[],props:{defaultChecked:{defaultValue:null,declarations:[{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"},{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"}],description:"",name:"defaultChecked",parent:{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"},required:!1,tags:{},type:{name:"boolean | undefined"}}},tags:{}}}catch{}const ot={title:"UI-Kit/Stack",component:r,tags:["autodocs"],parameters:{docs:{description:{component:"Stack is a flex vertical layout container that maps directly to Mantine's Stack component allowing safe layout property passing."}}},args:{gap:"rec-default",align:"stretch",justify:"flex-start"},argTypes:{gap:{control:"select",options:["rec-none","rec-sm","rec-default","rec-md","rec-lg","rec-xl","rec-2xl","xs","sm","md","lg","xl"],description:"Gap between elements"},align:{control:"select",options:["flex-start","center","flex-end","stretch"],description:"Align-items property"},justify:{control:"select",options:["flex-start","center","flex-end","space-between","space-around"],description:"Justify-content property"},defaultChecked:{table:{disable:!0}}}},u={render:e=>t.jsxs(r,{...e,children:[t.jsx(a,{variant:"solid",children:"Primary Block"}),t.jsx(a,{variant:"outline",children:"Secondary Block"}),t.jsx(V,{children:"Text element within Stack"})]})},f={args:{gap:"rec-sm"},render:e=>t.jsxs(r,{...e,children:[t.jsx(a,{variant:"solid",children:"Item 1"}),t.jsx(a,{variant:"solid",children:"Item 2"}),t.jsx(a,{variant:"solid",children:"Item 3"})]})},g={args:{gap:"rec-xl"},render:e=>t.jsxs(r,{...e,children:[t.jsx(a,{variant:"solid",children:"Item 1"}),t.jsx(a,{variant:"solid",children:"Item 2"}),t.jsx(a,{variant:"solid",children:"Item 3"})]})};var B,v,j;u.parameters={...u.parameters,docs:{...(B=u.parameters)==null?void 0:B.docs,source:{originalSource:`{
  render: args => <Stack {...args}>
      <Button variant="solid">Primary Block</Button>
      <Button variant="outline">Secondary Block</Button>
      <Text>Text element within Stack</Text>
    </Stack>
}`,...(j=(v=u.parameters)==null?void 0:v.docs)==null?void 0:j.source}}};var _,N,I;f.parameters={...f.parameters,docs:{...(_=f.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    gap: "rec-sm"
  },
  render: args => <Stack {...args}>
      <Button variant="solid">Item 1</Button>
      <Button variant="solid">Item 2</Button>
      <Button variant="solid">Item 3</Button>
    </Stack>
}`,...(I=(N=f.parameters)==null?void 0:N.docs)==null?void 0:I.source}}};var b,T,P;g.parameters={...g.parameters,docs:{...(b=g.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    gap: "rec-xl"
  },
  render: args => <Stack {...args}>
      <Button variant="solid">Item 1</Button>
      <Button variant="solid">Item 2</Button>
      <Button variant="solid">Item 3</Button>
    </Stack>
}`,...(P=(T=g.parameters)==null?void 0:T.docs)==null?void 0:P.source}}};const nt=["Default","StaticGapSmall","StaticGapLarge"];export{u as Default,g as StaticGapLarge,f as StaticGapSmall,nt as __namedExportsOrder,ot as default};

import{u as q,j as e,r as H,f as V}from"./iframe-BlyjOLeZ.js";import{u as O,d as Y,j as z,p as J,I as K,B as U,k as W,c as X}from"./factory-DLKEpXnh.js";import{p as Q}from"./polymorphic-factory-CAKH0E_l.js";import{B as r}from"./Button-BCD_j59f.js";import{T as Z}from"./Text-CcEYh7RF.js";import"./preload-helper-Dp1pzeXC.js";import"./get-size-AZBW9FMn.js";import"./Loader-CG0knn21.js";import"./Transition-Bar4Phoa.js";import"./index-B7PH_peB.js";import"./index-DJkV7rdH.js";import"./use-reduced-motion-DlBLUqd4.js";import"./UnstyledButton-cwPISIpE.js";import"./Text-0sJAhae3.js";const ee={gap:{type:"spacing",property:"gap"},rowGap:{type:"spacing",property:"rowGap"},columnGap:{type:"spacing",property:"columnGap"},align:{type:"identity",property:"alignItems"},justify:{type:"identity",property:"justifyContent"},wrap:{type:"identity",property:"flexWrap"},direction:{type:"identity",property:"flexDirection"}};var P={root:"m_8bffd616"};const w=Q((n,o)=>{const t=O("Flex",null,n),{classNames:g,className:h,style:F,styles:l,unstyled:c,vars:p,gap:a,rowGap:d,columnGap:b,align:m,justify:C,wrap:k,direction:A,attributes:$,...E}=t,M=Y({name:"Flex",classes:P,props:t,className:h,style:F,classNames:g,styles:l,unstyled:c,attributes:$,vars:p}),D=q(),v=z(),u=J({styleProps:{gap:a,rowGap:d,columnGap:b,align:m,justify:C,wrap:k,direction:A},theme:D,data:ee});return e.jsxs(e.Fragment,{children:[u.hasResponsiveStyles&&e.jsx(K,{selector:`.${v}`,styles:u.styles,media:u.media}),e.jsx(U,{ref:o,...M("root",{className:v,style:W(u.inlineStyles)}),...E})]})});w.classes=P;w.displayName="@mantine/core/Flex";const te="Flex-module__root___yYser",i={root:te},R=H.forwardRef(function({children:o,overStyled:t=!1,gap:g="rec-default",...h},F){const l=V({...h,gap:g},t),c=l,p={root:i.root},a=c.classNames;if(a&&typeof a=="object"&&!Array.isArray(a)){const m=a;p.root=m.root?`${i.root} ${m.root}`:i.root}const d=c.className,b=d?`${i.root} ${d}`:i.root;return e.jsx(w,{ref:F,className:b,classNames:p,...l,children:o})});R.displayName="Flex";const s=X(R);try{s.displayName="Flex",s.__docgenInfo={description:"Recursica Flex layout wrapper.\n\nSupports polymorphism via the `component` prop or `renderRoot` for custom element rendering.",displayName:"Flex",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Flex/Flex.tsx",methods:[],props:{defaultChecked:{defaultValue:null,declarations:[{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"},{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"}],description:"",name:"defaultChecked",parent:{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"},required:!1,tags:{},type:{name:"boolean | undefined"}},component:{defaultValue:null,declarations:[{fileName:"recursica/node_modules/@mantine/core/lib/core/factory/create-polymorphic-component.d.ts",name:"TypeLiteral"},{fileName:"recursica/node_modules/@mantine/core/lib/core/factory/create-polymorphic-component.d.ts",name:"TypeLiteral"}],description:"",name:"component",required:!1,tags:{},type:{name:'"symbol" | "object" | "style" | "p" | "td" | "button" | "text" | "small" | "a" | "abbr" | "address" | "area" | "article" | "aside" | "audio" | "b" | "base" | "bdi" | "bdo" | "big" | ... 160 more ... | undefined'}},renderRoot:{defaultValue:null,declarations:[{fileName:"recursica/node_modules/@mantine/core/lib/core/factory/create-polymorphic-component.d.ts",name:"TypeLiteral"},{fileName:"recursica/node_modules/@mantine/core/lib/core/factory/create-polymorphic-component.d.ts",name:"TypeLiteral"}],description:"",name:"renderRoot",required:!1,tags:{},type:{name:"((props: any) => any) | ((props: Record<string, any>) => any) | undefined"}}},tags:{example:'```tsx\n<Flex component="nav">...</Flex>\n<Flex component="section">...</Flex>\n```'}}}catch{}const fe={title:"UI-Kit/Flex",component:s,tags:["autodocs"],parameters:{docs:{description:{component:"Flex is a bare-metal flex container that maps directly to Mantine's Flex component, providing unopinionated control over direction, alignment, and wrapping."}}},args:{gap:"rec-default",align:"center",justify:"flex-start",direction:"row",wrap:"wrap"},argTypes:{gap:{control:"select",options:["rec-none","rec-sm","rec-default","rec-md","rec-lg","rec-xl","rec-2xl","xs","sm","md","lg","xl"],description:"Gap between elements"},direction:{control:"select",options:["row","column","row-reverse","column-reverse"],description:"Flex-direction property"},align:{control:"select",options:["flex-start","center","flex-end","stretch"],description:"Align-items property"},justify:{control:"select",options:["flex-start","center","flex-end","space-between","space-around"],description:"Justify-content property"},wrap:{control:"select",options:["wrap","nowrap","wrap-reverse"],description:"Flex-wrap property"},defaultChecked:{table:{disable:!0}},rowGap:{table:{disable:!0}},columnGap:{table:{disable:!0}}}},y={render:({withLayer:n,layer:o,...t})=>e.jsxs(s,{...t,children:[e.jsx(r,{variant:"solid",children:"Block A"}),e.jsx(r,{variant:"outline",children:"Block B"}),e.jsx(Z,{children:"Text inside Flex"})]})},x={args:{gap:"rec-sm",direction:"column"},render:({withLayer:n,layer:o,...t})=>e.jsxs(s,{...t,children:[e.jsx(r,{variant:"solid",children:"Item 1"}),e.jsx(r,{variant:"solid",children:"Item 2"}),e.jsx(r,{variant:"solid",children:"Item 3"})]})},f={args:{gap:"rec-xl",direction:"row"},render:({withLayer:n,layer:o,...t})=>e.jsxs(s,{...t,children:[e.jsx(r,{variant:"solid",children:"Item 1"}),e.jsx(r,{variant:"solid",children:"Item 2"}),e.jsx(r,{variant:"solid",children:"Item 3"})]})};var _,j,B;y.parameters={...y.parameters,docs:{...(_=y.parameters)==null?void 0:_.docs,source:{originalSource:`{
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
}`,...(B=(j=y.parameters)==null?void 0:j.docs)==null?void 0:B.source}}};var N,S,I;x.parameters={...x.parameters,docs:{...(N=x.parameters)==null?void 0:N.docs,source:{originalSource:`{
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
}`,...(I=(S=x.parameters)==null?void 0:S.docs)==null?void 0:I.source}}};var L,T,G;f.parameters={...f.parameters,docs:{...(L=f.parameters)==null?void 0:L.docs,source:{originalSource:`{
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
}`,...(G=(T=f.parameters)==null?void 0:T.docs)==null?void 0:G.source}}};const ge=["Default","StaticGapSmallColumn","StaticGapLargeRow"];export{y as Default,f as StaticGapLargeRow,x as StaticGapSmallColumn,ge as __namedExportsOrder,fe as default};

import{u as D,j as e,r as H,f as O}from"./iframe-62VCHLAo.js";import{u as Y,c as q,h as z,p as J,I as K,B as U,j as V}from"./factory-C1p_Iv34.js";import{p as W}from"./polymorphic-factory-VSsKQd_s.js";import{B as r}from"./Button-Bl7Z4z3x.js";import{T as X}from"./Text-BzKYDZJ6.js";import"./preload-helper-Dp1pzeXC.js";import"./get-size-qFIEsQoM.js";import"./Loader-BFDSj41w.js";import"./Transition-CHOagRjC.js";import"./index-DoaP3_2_.js";import"./index-BQHFkE77.js";import"./use-reduced-motion-BS3cKuM5.js";import"./UnstyledButton-B7jmV6FW.js";import"./Text-DfQLbCsK.js";const Q={gap:{type:"spacing",property:"gap"},rowGap:{type:"spacing",property:"rowGap"},columnGap:{type:"spacing",property:"columnGap"},align:{type:"identity",property:"alignItems"},justify:{type:"identity",property:"justifyContent"},wrap:{type:"identity",property:"flexWrap"},direction:{type:"identity",property:"flexDirection"}};var P={root:"m_8bffd616"};const F=W((n,a)=>{const t=Y("Flex",null,n),{classNames:f,className:h,style:w,styles:l,unstyled:c,vars:p,gap:o,rowGap:d,columnGap:v,align:m,justify:A,wrap:C,direction:k,attributes:R,...$}=t,E=q({name:"Flex",classes:P,props:t,className:h,style:w,classNames:f,styles:l,unstyled:c,attributes:R,vars:p}),M=D(),B=z(),u=J({styleProps:{gap:o,rowGap:d,columnGap:v,align:m,justify:A,wrap:C,direction:k},theme:M,data:Q});return e.jsxs(e.Fragment,{children:[u.hasResponsiveStyles&&e.jsx(K,{selector:`.${B}`,styles:u.styles,media:u.media}),e.jsx(U,{ref:a,...E("root",{className:B,style:V(u.inlineStyles)}),...$})]})});F.classes=P;F.displayName="@mantine/core/Flex";const Z="Flex-module__root___yYser",i={root:Z},s=H.forwardRef(function({children:a,overStyled:t=!1,gap:f="rec-default",...h},w){const l=O({...h,gap:f},t),c=l,p={root:i.root},o=c.classNames;if(o&&typeof o=="object"&&!Array.isArray(o)){const m=o;p.root=m.root?`${i.root} ${m.root}`:i.root}const d=c.className,v=d?`${i.root} ${d}`:i.root;return e.jsx(F,{ref:w,className:v,classNames:p,...l,children:a})});s.displayName="Flex";try{s.displayName="Flex",s.__docgenInfo={description:"",displayName:"Flex",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Flex/Flex.tsx",methods:[],props:{defaultChecked:{defaultValue:null,declarations:[{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"},{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"}],description:"",name:"defaultChecked",parent:{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"},required:!1,tags:{},type:{name:"boolean | undefined"}}},tags:{}}}catch{}const ye={title:"UI-Kit/Flex",component:s,tags:["autodocs"],parameters:{docs:{description:{component:"Flex is a bare-metal flex container that maps directly to Mantine's Flex component, providing unopinionated control over direction, alignment, and wrapping."}}},args:{gap:"rec-default",align:"center",justify:"flex-start",direction:"row",wrap:"wrap"},argTypes:{gap:{control:"select",options:["rec-none","rec-sm","rec-default","rec-md","rec-lg","rec-xl","rec-2xl","xs","sm","md","lg","xl"],description:"Gap between elements"},direction:{control:"select",options:["row","column","row-reverse","column-reverse"],description:"Flex-direction property"},align:{control:"select",options:["flex-start","center","flex-end","stretch"],description:"Align-items property"},justify:{control:"select",options:["flex-start","center","flex-end","space-between","space-around"],description:"Justify-content property"},wrap:{control:"select",options:["wrap","nowrap","wrap-reverse"],description:"Flex-wrap property"},defaultChecked:{table:{disable:!0}},rowGap:{table:{disable:!0}},columnGap:{table:{disable:!0}}}},y={render:({withLayer:n,layer:a,...t})=>e.jsxs(s,{...t,children:[e.jsx(r,{variant:"solid",children:"Block A"}),e.jsx(r,{variant:"outline",children:"Block B"}),e.jsx(X,{children:"Text inside Flex"})]})},x={args:{gap:"rec-sm",direction:"column"},render:({withLayer:n,layer:a,...t})=>e.jsxs(s,{...t,children:[e.jsx(r,{variant:"solid",children:"Item 1"}),e.jsx(r,{variant:"solid",children:"Item 2"}),e.jsx(r,{variant:"solid",children:"Item 3"})]})},g={args:{gap:"rec-xl",direction:"row"},render:({withLayer:n,layer:a,...t})=>e.jsxs(s,{...t,children:[e.jsx(r,{variant:"solid",children:"Item 1"}),e.jsx(r,{variant:"solid",children:"Item 2"}),e.jsx(r,{variant:"solid",children:"Item 3"})]})};var j,_,b;y.parameters={...y.parameters,docs:{...(j=y.parameters)==null?void 0:j.docs,source:{originalSource:`{
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
}`,...(b=(_=y.parameters)==null?void 0:_.docs)==null?void 0:b.source}}};var N,S,I;x.parameters={...x.parameters,docs:{...(N=x.parameters)==null?void 0:N.docs,source:{originalSource:`{
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
}`,...(I=(S=x.parameters)==null?void 0:S.docs)==null?void 0:I.source}}};var G,L,T;g.parameters={...g.parameters,docs:{...(G=g.parameters)==null?void 0:G.docs,source:{originalSource:`{
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
}`,...(T=(L=g.parameters)==null?void 0:L.docs)==null?void 0:T.source}}};const xe=["Default","StaticGapSmallColumn","StaticGapLargeRow"];export{y as Default,g as StaticGapLargeRow,x as StaticGapSmallColumn,xe as __namedExportsOrder,ye as default};

import{r as z,j as n}from"./iframe-DsZc3vsf.js";import{C as L}from"./Container-CXz94765.js";import{T as p}from"./Text-DeJHUOgV.js";import"./preload-helper-Dp1pzeXC.js";import"./get-size-CjwDHwpK.js";import"./factory-BP28tkBZ.js";import"./Text-DPUl_d5e.js";import"./polymorphic-factory-C-Jj8IzR.js";const S="Container-module__root___UVssr",a={root:S},r=z.forwardRef(function({children:o,size:e,...l},j){const m={"rec-sm":"sm","rec-default":"md","rec-md":"md","rec-lg":"lg","rec-xl":"xl","rec-2xl":"xl"},T=typeof e=="string"&&m[e]?m[e]:e,u={root:a.root},s=l.classNames;if(s&&typeof s=="object"&&!Array.isArray(s)){const y=s;u.root=y.root?`${a.root} ${y.root}`:a.root}const x=l.className,N=x?`${a.root} ${x}`:a.root;return n.jsx(L,{ref:j,size:T,className:N,classNames:u,...l,children:o})});r.displayName="Container";try{r.displayName="Container",r.__docgenInfo={description:"",displayName:"Container",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Container/Container.tsx",methods:[],props:{defaultChecked:{defaultValue:null,declarations:[{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"}],description:"",name:"defaultChecked",parent:{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"},required:!1,tags:{},type:{name:"boolean | undefined"}},size:{defaultValue:null,declarations:[{fileName:"mantine-adapter/src/components/Container/Container.tsx",name:"RecursicaContainerProps"}],description:"Maximum width defined by Mantine system sizes or Recursica sizes",name:"size",parent:{fileName:"mantine-adapter/src/components/Container/Container.tsx",name:"RecursicaContainerProps"},required:!1,tags:{},type:{name:'number | (string & {}) | "xs" | "sm" | "md" | "lg" | "xl" | RecursicaSpacing | undefined'}}},tags:{}}}catch{}const V={title:"UI-Kit/Container",component:r,tags:["autodocs"],parameters:{docs:{description:{component:"Container is a generic layout wrapper that safely maps to Mantine's Container, standardizing maximum content widths across the application."}}},args:{size:"md",fluid:!1},argTypes:{size:{control:"select",options:["xs","sm","md","lg","xl","rec-sm","rec-default","rec-md","rec-lg","rec-xl","rec-2xl"],description:"Maximum width defined by Mantine system sizes or Recursica sizes"},fluid:{control:"boolean",description:"If true, overrides size and sets max-width to 100%"},defaultChecked:{table:{disable:!0}}}},i={render:({withLayer:t,layer:o,...e})=>n.jsx("div",{style:{backgroundColor:"#f0f0f0",padding:"16px"},children:n.jsx(r,{...e,style:{backgroundColor:"white",padding:"16px",border:"1px solid #ccc"},children:n.jsx(p,{children:"This is a Container holding centered content. The background and border are added just to demonstrate the layout bounds visually."})})})},d={args:{size:"sm"},render:({withLayer:t,layer:o,...e})=>n.jsx("div",{style:{backgroundColor:"#f0f0f0",padding:"16px"},children:n.jsx(r,{...e,style:{backgroundColor:"white",padding:"16px",border:"1px solid #ccc"},children:n.jsx(p,{children:"Small Container Layout"})})})},c={args:{fluid:!0},render:({withLayer:t,layer:o,...e})=>n.jsx("div",{style:{backgroundColor:"#f0f0f0",padding:"16px"},children:n.jsx(r,{...e,style:{backgroundColor:"white",padding:"16px",border:"1px solid #ccc"},children:n.jsx(p,{children:"Fluid Container Layout"})})})};var g,f,C;i.parameters={...i.parameters,docs:{...(g=i.parameters)==null?void 0:g.docs,source:{originalSource:`{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => <div style={{
    backgroundColor: "#f0f0f0",
    padding: "16px"
  }}>
      <Container {...args} style={{
      backgroundColor: "white",
      padding: "16px",
      border: "1px solid #ccc"
    }}>
        <Text>
          This is a Container holding centered content. The background and
          border are added just to demonstrate the layout bounds visually.
        </Text>
      </Container>
    </div>
}`,...(C=(f=i.parameters)==null?void 0:f.docs)==null?void 0:C.source}}};var h,b,k;d.parameters={...d.parameters,docs:{...(h=d.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    size: "sm"
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => <div style={{
    backgroundColor: "#f0f0f0",
    padding: "16px"
  }}>
      <Container {...args} style={{
      backgroundColor: "white",
      padding: "16px",
      border: "1px solid #ccc"
    }}>
        <Text>Small Container Layout</Text>
      </Container>
    </div>
}`,...(k=(b=d.parameters)==null?void 0:b.docs)==null?void 0:k.source}}};var w,_,v;c.parameters={...c.parameters,docs:{...(w=c.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    fluid: true
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => <div style={{
    backgroundColor: "#f0f0f0",
    padding: "16px"
  }}>
      <Container {...args} style={{
      backgroundColor: "white",
      padding: "16px",
      border: "1px solid #ccc"
    }}>
        <Text>Fluid Container Layout</Text>
      </Container>
    </div>
}`,...(v=(_=c.parameters)==null?void 0:_.docs)==null?void 0:v.source}}};const q=["Default","SmallContainer","FluidContainer"];export{i as Default,c as FluidContainer,d as SmallContainer,q as __namedExportsOrder,V as default};

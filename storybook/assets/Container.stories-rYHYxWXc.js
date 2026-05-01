import{r as R,f as M,j as n}from"./iframe-62VCHLAo.js";import{C as P}from"./Container--KDbtrFs.js";import{T as l}from"./Text-BzKYDZJ6.js";import"./preload-helper-Dp1pzeXC.js";import"./get-size-qFIEsQoM.js";import"./factory-C1p_Iv34.js";import"./Text-DfQLbCsK.js";import"./polymorphic-factory-VSsKQd_s.js";const A="Container-module__root___UVssr",t={root:A},r=R.forwardRef(function({children:s,size:e,overStyled:T=!1,...j},z){const p=M(j,T),m=p,u={"rec-sm":"sm","rec-default":"md","rec-md":"md","rec-lg":"lg","rec-xl":"xl","rec-2xl":"xl"},L=typeof e=="string"&&u[e]?u[e]:e,x={root:t.root},o=m.classNames;if(o&&typeof o=="object"&&!Array.isArray(o)){const f=o;x.root=f.root?`${t.root} ${f.root}`:t.root}const y=m.className,S=y?`${t.root} ${y}`:t.root;return n.jsx(P,{ref:z,size:L,className:S,classNames:x,...p,children:s})});r.displayName="Container";try{r.displayName="Container",r.__docgenInfo={description:"",displayName:"Container",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Container/Container.tsx",methods:[],props:{defaultChecked:{defaultValue:null,declarations:[{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"},{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"}],description:"",name:"defaultChecked",parent:{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"},required:!1,tags:{},type:{name:"boolean | undefined"}},size:{defaultValue:null,declarations:[{fileName:"mantine-adapter/src/components/Container/Container.tsx",name:"RecursicaContainerProps"},{fileName:"mantine-adapter/src/components/Container/Container.tsx",name:"RecursicaContainerProps"}],description:"Maximum width defined by Mantine system sizes or Recursica sizes",name:"size",parent:{fileName:"mantine-adapter/src/components/Container/Container.tsx",name:"RecursicaContainerProps"},required:!1,tags:{},type:{name:'number | (string & {}) | "xs" | "sm" | "md" | "lg" | "xl" | RecursicaSpacing | undefined'}}},tags:{}}}catch{}const U={title:"UI-Kit/Container",component:r,tags:["autodocs"],parameters:{docs:{description:{component:"Container is a generic layout wrapper that safely maps to Mantine's Container, standardizing maximum content widths across the application."}}},args:{size:"md",fluid:!1},argTypes:{size:{control:"select",options:["xs","sm","md","lg","xl","rec-sm","rec-default","rec-md","rec-lg","rec-xl","rec-2xl"],description:"Maximum width defined by Mantine system sizes or Recursica sizes"},fluid:{control:"boolean",description:"If true, overrides size and sets max-width to 100%"},defaultChecked:{table:{disable:!0}}}},i={render:({withLayer:a,layer:s,...e})=>n.jsx("div",{style:{backgroundColor:"#f0f0f0",padding:"16px"},children:n.jsx(r,{...e,style:{backgroundColor:"white",padding:"16px",border:"1px solid #ccc"},children:n.jsx(l,{children:"This is a Container holding centered content. The background and border are added just to demonstrate the layout bounds visually."})})})},d={args:{size:"sm"},render:({withLayer:a,layer:s,...e})=>n.jsx("div",{style:{backgroundColor:"#f0f0f0",padding:"16px"},children:n.jsx(r,{...e,style:{backgroundColor:"white",padding:"16px",border:"1px solid #ccc"},children:n.jsx(l,{children:"Small Container Layout"})})})},c={args:{fluid:!0},render:({withLayer:a,layer:s,...e})=>n.jsx("div",{style:{backgroundColor:"#f0f0f0",padding:"16px"},children:n.jsx(r,{...e,style:{backgroundColor:"white",padding:"16px",border:"1px solid #ccc"},children:n.jsx(l,{children:"Fluid Container Layout"})})})};var g,C,h;i.parameters={...i.parameters,docs:{...(g=i.parameters)==null?void 0:g.docs,source:{originalSource:`{
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
}`,...(h=(C=i.parameters)==null?void 0:C.docs)==null?void 0:h.source}}};var b,k,w;d.parameters={...d.parameters,docs:{...(b=d.parameters)==null?void 0:b.docs,source:{originalSource:`{
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
}`,...(w=(k=d.parameters)==null?void 0:k.docs)==null?void 0:w.source}}};var _,v,N;c.parameters={...c.parameters,docs:{...(_=c.parameters)==null?void 0:_.docs,source:{originalSource:`{
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
}`,...(N=(v=c.parameters)==null?void 0:v.docs)==null?void 0:N.source}}};const K=["Default","SmallContainer","FluidContainer"];export{i as Default,c as FluidContainer,d as SmallContainer,K as __namedExportsOrder,U as default};

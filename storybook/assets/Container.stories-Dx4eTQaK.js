import{r as M,f as P,j as e}from"./iframe-BHhWYZEC.js";import{C as L}from"./Container-D-BPSwUM.js";import{T as c}from"./Text-C3hHQqV5.js";import"./preload-helper-Dp1pzeXC.js";import"./get-size-BlbtXTyo.js";import"./factory-CVE1eDgt.js";import"./Text-DkiQWGps.js";import"./polymorphic-factory-CnLU5YW3.js";const A="Container-module__root___UVssr",a={root:A},n=M.forwardRef(function({children:j,size:o,overStyled:v=!1,...w},z){const l=P(w,v),p=l,m={"rec-sm":"sm","rec-default":"md","rec-md":"md","rec-lg":"lg","rec-xl":"xl","rec-2xl":"xl"},S=typeof o=="string"&&m[o]?m[o]:o,u={root:a.root},t=p.classNames;if(t&&typeof t=="object"&&!Array.isArray(t)){const g=t;u.root=g.root?`${a.root} ${g.root}`:a.root}const f=p.className,R=f?`${a.root} ${f}`:a.root;return e.jsx(L,{ref:z,size:S,className:R,classNames:u,...l,children:j})});n.displayName="Container";try{n.displayName="Container",n.__docgenInfo={description:"",displayName:"Container",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Container/Container.tsx",methods:[],props:{defaultChecked:{defaultValue:null,declarations:[{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"},{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"}],description:"",name:"defaultChecked",parent:{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"},required:!1,tags:{},type:{name:"boolean | undefined"}},size:{defaultValue:null,declarations:[{fileName:"mantine-adapter/src/components/Container/Container.tsx",name:"RecursicaContainerProps"},{fileName:"mantine-adapter/src/components/Container/Container.tsx",name:"RecursicaContainerProps"}],description:"Maximum width defined by Mantine system sizes or Recursica sizes",name:"size",parent:{fileName:"mantine-adapter/src/components/Container/Container.tsx",name:"RecursicaContainerProps"},required:!1,tags:{},type:{name:'number | (string & {}) | "xs" | "sm" | "md" | "lg" | "xl" | RecursicaSpacing | undefined'}}},tags:{}}}catch{}const U={title:"UI-Kit/Container",component:n,tags:["autodocs"],parameters:{docs:{description:{component:"Container is a generic layout wrapper that safely maps to Mantine's Container, standardizing maximum content widths across the application."}}},args:{size:"md",fluid:!1},argTypes:{size:{control:"select",options:["xs","sm","md","lg","xl","rec-sm","rec-default","rec-md","rec-lg","rec-xl","rec-2xl"],description:"Maximum width defined by Mantine system sizes or Recursica sizes"},fluid:{control:"boolean",description:"If true, overrides size and sets max-width to 100%"},defaultChecked:{table:{disable:!0}}}},s={render:r=>e.jsx("div",{style:{backgroundColor:"#f0f0f0",padding:"16px"},children:e.jsx(n,{...r,style:{backgroundColor:"white",padding:"16px",border:"1px solid #ccc"},children:e.jsx(c,{children:"This is a Container holding centered content. The background and border are added just to demonstrate the layout bounds visually."})})})},i={args:{size:"sm"},render:r=>e.jsx("div",{style:{backgroundColor:"#f0f0f0",padding:"16px"},children:e.jsx(n,{...r,style:{backgroundColor:"white",padding:"16px",border:"1px solid #ccc"},children:e.jsx(c,{children:"Small Container Layout"})})})},d={args:{fluid:!0},render:r=>e.jsx("div",{style:{backgroundColor:"#f0f0f0",padding:"16px"},children:e.jsx(n,{...r,style:{backgroundColor:"white",padding:"16px",border:"1px solid #ccc"},children:e.jsx(c,{children:"Fluid Container Layout"})})})};var x,C,y;s.parameters={...s.parameters,docs:{...(x=s.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: args => <div style={{
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
}`,...(y=(C=s.parameters)==null?void 0:C.docs)==null?void 0:y.source}}};var h,b,k;i.parameters={...i.parameters,docs:{...(h=i.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    size: "sm"
  },
  render: args => <div style={{
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
}`,...(k=(b=i.parameters)==null?void 0:b.docs)==null?void 0:k.source}}};var _,N,T;d.parameters={...d.parameters,docs:{...(_=d.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    fluid: true
  },
  render: args => <div style={{
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
}`,...(T=(N=d.parameters)==null?void 0:N.docs)==null?void 0:T.source}}};const K=["Default","SmallContainer","FluidContainer"];export{s as Default,d as FluidContainer,i as SmallContainer,K as __namedExportsOrder,U as default};

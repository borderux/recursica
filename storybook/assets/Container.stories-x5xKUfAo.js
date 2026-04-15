import{r as z,f as S,j as e}from"./iframe-d8_mgu_F.js";import{C as L}from"./Container-Cyhu4lb9.js";import{T as i}from"./Text-Bt36CO3M.js";import"./preload-helper-Dp1pzeXC.js";import"./get-size-J7CBMG80.js";import"./factory-BnxMGGpV.js";import"./Text-D5Ei7a1m.js";import"./polymorphic-factory-D_h49hYh.js";const M="Container-module__root___UVssr",o={root:M},n=z.forwardRef(function({children:T,overStyled:j=!1,...N},v){const c=S(N,j),l=c,p={root:o.root},t=l.classNames;if(t&&typeof t=="object"&&!Array.isArray(t)){const m=t;p.root=m.root?`${o.root} ${m.root}`:o.root}const u=l.className,w=u?`${o.root} ${u}`:o.root;return e.jsx(L,{ref:v,className:w,classNames:p,...c,children:T})});n.displayName="Container";try{n.displayName="Container",n.__docgenInfo={description:"",displayName:"Container",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Container/Container.tsx",methods:[],props:{defaultChecked:{defaultValue:null,declarations:[{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"},{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"}],description:"",name:"defaultChecked",parent:{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"},required:!1,tags:{},type:{name:"boolean | undefined"}}},tags:{}}}catch{}const D={title:"UI-Kit/Container",component:n,tags:["autodocs"],parameters:{docs:{description:{component:"Container is a generic layout wrapper that safely maps to Mantine's Container, standardizing maximum content widths across the application."}}},args:{size:"md",fluid:!1},argTypes:{size:{control:"select",options:["xs","sm","md","lg","xl"],description:"Maximum width defined by Mantine system sizes"},fluid:{control:"boolean",description:"If true, overrides size and sets max-width to 100%"},defaultChecked:{table:{disable:!0}}}},a={render:r=>e.jsx("div",{style:{backgroundColor:"#f0f0f0",padding:"16px"},children:e.jsx(n,{...r,style:{backgroundColor:"white",padding:"16px",border:"1px solid #ccc"},children:e.jsx(i,{children:"This is a Container holding centered content. The background and border are added just to demonstrate the layout bounds visually."})})})},s={args:{size:"sm"},render:r=>e.jsx("div",{style:{backgroundColor:"#f0f0f0",padding:"16px"},children:e.jsx(n,{...r,style:{backgroundColor:"white",padding:"16px",border:"1px solid #ccc"},children:e.jsx(i,{children:"Small Container Layout"})})})},d={args:{fluid:!0},render:r=>e.jsx("div",{style:{backgroundColor:"#f0f0f0",padding:"16px"},children:e.jsx(n,{...r,style:{backgroundColor:"white",padding:"16px",border:"1px solid #ccc"},children:e.jsx(i,{children:"Fluid Container Layout"})})})};var g,f,x;a.parameters={...a.parameters,docs:{...(g=a.parameters)==null?void 0:g.docs,source:{originalSource:`{
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
}`,...(x=(f=a.parameters)==null?void 0:f.docs)==null?void 0:x.source}}};var C,y,h;s.parameters={...s.parameters,docs:{...(C=s.parameters)==null?void 0:C.docs,source:{originalSource:`{
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
}`,...(h=(y=s.parameters)==null?void 0:y.docs)==null?void 0:h.source}}};var b,k,_;d.parameters={...d.parameters,docs:{...(b=d.parameters)==null?void 0:b.docs,source:{originalSource:`{
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
}`,...(_=(k=d.parameters)==null?void 0:k.docs)==null?void 0:_.source}}};const U=["Default","SmallContainer","FluidContainer"];export{a as Default,d as FluidContainer,s as SmallContainer,U as __namedExportsOrder,D as default};

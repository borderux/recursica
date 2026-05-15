import{j as e}from"./iframe-alR3zAUJ.js";import{C as o}from"./Container-odvWjH5H.js";import{T as i}from"./Text-BW2XHE0S.js";import"./preload-helper-Dp1pzeXC.js";import"./get-size-CgeYFbt0.js";import"./factory-Dof06U1Z.js";import"./Text-tnQm4cOp.js";import"./polymorphic-factory-hZyKLKPT.js";const L={title:"UI-Kit/Container",component:o,tags:["autodocs"],parameters:{docs:{description:{component:"Container is a generic layout wrapper that safely maps to Mantine's Container, standardizing maximum content widths across the application."}}},args:{size:"md",fluid:!1},argTypes:{size:{control:"select",options:["xs","sm","md","lg","xl","rec-sm","rec-default","rec-md","rec-lg","rec-xl","rec-2xl"],description:"Maximum width defined by Mantine system sizes or Recursica sizes"},fluid:{control:"boolean",description:"If true, overrides size and sets max-width to 100%"},defaultChecked:{table:{disable:!0}}}},r={render:({withLayer:s,layer:d,...n})=>e.jsx("div",{style:{backgroundColor:"#f0f0f0",padding:"16px"},children:e.jsx(o,{...n,style:{backgroundColor:"white",padding:"16px",border:"1px solid #ccc"},children:e.jsx(i,{children:"This is a Container holding centered content. The background and border are added just to demonstrate the layout bounds visually."})})})},t={args:{size:"sm"},render:({withLayer:s,layer:d,...n})=>e.jsx("div",{style:{backgroundColor:"#f0f0f0",padding:"16px"},children:e.jsx(o,{...n,style:{backgroundColor:"white",padding:"16px",border:"1px solid #ccc"},children:e.jsx(i,{children:"Small Container Layout"})})})},a={args:{fluid:!0},render:({withLayer:s,layer:d,...n})=>e.jsx("div",{style:{backgroundColor:"#f0f0f0",padding:"16px"},children:e.jsx(o,{...n,style:{backgroundColor:"white",padding:"16px",border:"1px solid #ccc"},children:e.jsx(i,{children:"Fluid Container Layout"})})})};var l,c,p;r.parameters={...r.parameters,docs:{...(l=r.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
}`,...(p=(c=r.parameters)==null?void 0:c.docs)==null?void 0:p.source}}};var u,x,m;t.parameters={...t.parameters,docs:{...(u=t.parameters)==null?void 0:u.docs,source:{originalSource:`{
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
}`,...(m=(x=t.parameters)==null?void 0:x.docs)==null?void 0:m.source}}};var y,g,h;a.parameters={...a.parameters,docs:{...(y=a.parameters)==null?void 0:y.docs,source:{originalSource:`{
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
}`,...(h=(g=a.parameters)==null?void 0:g.docs)==null?void 0:h.source}}};const z=["Default","SmallContainer","FluidContainer"];export{r as Default,a as FluidContainer,t as SmallContainer,z as __namedExportsOrder,L as default};

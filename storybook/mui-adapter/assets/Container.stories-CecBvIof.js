import{j as e}from"./iframe-ET1O9uy4.js";import{C as o}from"./Container-Br2RwcwO.js";import{T as i}from"./Text-BiD1-xnZ.js";import"./preload-helper-Dp1pzeXC.js";import"./styled-NHfFC7RQ.js";import"./styled-Bq2TYJRz.js";import"./useThemeProps-CMdwUTLA.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./Typography-BHhSeesA.js";import"./Typography-BAZytbpX.js";import"./memoTheme-DivAIOBF.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";const M={title:"UI-Kit/Container",component:o,tags:["autodocs"],parameters:{docs:{description:{component:"Container is a generic layout wrapper that safely maps to Mantine's Container, standardizing maximum content widths across the application."}}},args:{size:"md",fluid:!1},argTypes:{size:{control:"select",options:["xs","sm","md","lg","xl","rec-sm","rec-default","rec-md","rec-lg","rec-xl","rec-2xl"],description:"Maximum width defined by Mantine system sizes or Recursica sizes"},fluid:{control:"boolean",description:"If true, overrides size and sets max-width to 100%"},defaultChecked:{table:{disable:!0}}}},r={render:({withLayer:s,layer:d,...n})=>e.jsx("div",{style:{backgroundColor:"#f0f0f0",padding:"16px"},children:e.jsx(o,{...n,style:{backgroundColor:"white",padding:"16px",border:"1px solid #ccc"},children:e.jsx(i,{children:"This is a Container holding centered content. The background and border are added just to demonstrate the layout bounds visually."})})})},t={args:{size:"sm"},render:({withLayer:s,layer:d,...n})=>e.jsx("div",{style:{backgroundColor:"#f0f0f0",padding:"16px"},children:e.jsx(o,{...n,style:{backgroundColor:"white",padding:"16px",border:"1px solid #ccc"},children:e.jsx(i,{children:"Small Container Layout"})})})},a={args:{fluid:!0},render:({withLayer:s,layer:d,...n})=>e.jsx("div",{style:{backgroundColor:"#f0f0f0",padding:"16px"},children:e.jsx(o,{...n,style:{backgroundColor:"white",padding:"16px",border:"1px solid #ccc"},children:e.jsx(i,{children:"Fluid Container Layout"})})})};var l,c,p;r.parameters={...r.parameters,docs:{...(l=r.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
}`,...(p=(c=r.parameters)==null?void 0:c.docs)==null?void 0:p.source}}};var u,m,x;t.parameters={...t.parameters,docs:{...(u=t.parameters)==null?void 0:u.docs,source:{originalSource:`{
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
}`,...(x=(m=t.parameters)==null?void 0:m.docs)==null?void 0:x.source}}};var y,g,h;a.parameters={...a.parameters,docs:{...(y=a.parameters)==null?void 0:y.docs,source:{originalSource:`{
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
}`,...(h=(g=a.parameters)==null?void 0:g.docs)==null?void 0:h.source}}};const D=["Default","SmallContainer","FluidContainer"];export{r as Default,a as FluidContainer,t as SmallContainer,D as __namedExportsOrder,M as default};

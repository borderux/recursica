import{j as e}from"./iframe-Hqhg3Da1.js";import{H as r}from"./Heading-DKOQld0c.js";import"./preload-helper-Dp1pzeXC.js";import"./factory-BczmY60U.js";const u={title:"UI-Kit/Heading",component:r,tags:["autodocs"],parameters:{docs:{description:{component:"The semantic `<Heading>` abstraction intrinsically links pure `h1-h6` tag generation with exact Recursica design boundaries to preserve SEO and screen reader trees uniformly globally."}}},argTypes:{order:{control:"select",options:[1,2,3,4,5,6],description:"Controls the `h` tag and the resultant typographical weighting natively mapped to Recursica."}}},n={args:{order:1,children:"Semantic H1 Document Boundary"},render:({...g})=>e.jsx(r,{...g})},a={args:{},render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"24px"},children:[e.jsx(r,{order:1,children:"H1 Heading"}),e.jsx(r,{order:2,children:"H2 Heading"}),e.jsx(r,{order:3,children:"H3 Heading"}),e.jsx(r,{order:4,children:"H4 Heading"}),e.jsx(r,{order:5,children:"H5 Heading"}),e.jsx(r,{order:6,children:"H6 Heading"})]})};var i,d,o;n.parameters={...n.parameters,docs:{...(i=n.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    order: 1,
    children: "Semantic H1 Document Boundary"
  },
  render: ({
    ...args
  }) => <Heading {...args} />
}`,...(o=(d=n.parameters)==null?void 0:d.docs)==null?void 0:o.source}}};var s,t,c;a.parameters={...a.parameters,docs:{...(s=a.parameters)==null?void 0:s.docs,source:{originalSource:`{
  args: {},
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "24px"
  }}>
      <Heading order={1}>H1 Heading</Heading>
      <Heading order={2}>H2 Heading</Heading>
      <Heading order={3}>H3 Heading</Heading>
      <Heading order={4}>H4 Heading</Heading>
      <Heading order={5}>H5 Heading</Heading>
      <Heading order={6}>H6 Heading</Heading>
    </div>
}`,...(c=(t=a.parameters)==null?void 0:t.docs)==null?void 0:c.source}}};const x=["Default","StaticVariations"];export{n as Default,a as StaticVariations,x as __namedExportsOrder,u as default};

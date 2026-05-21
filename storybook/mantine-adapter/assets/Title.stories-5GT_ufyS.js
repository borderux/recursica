import{j as e,$ as c}from"./iframe-DahVp6_-.js";import{T as r}from"./Title-Bw6ZRqKQ.js";import"./preload-helper-Dp1pzeXC.js";import"./factory-D_NNwu8P.js";const u={title:"UI-Kit/Title",component:r,tags:["autodocs"],parameters:{docs:{description:{component:"The semantic `<Title>` abstraction intrinsically links pure `h1-h6` tag generation with exact Recursica design boundaries to preserve SEO and screen reader trees uniformly globally."}}},argTypes:{order:{control:"select",options:[1,2,3,4,5,6],description:"Controls the `h` tag and the resultant typographical weighting natively mapped to Recursica."}}},t={args:{order:1,children:"Semantic H1 Document Boundary"},render:({...p})=>e.jsx(c,{layer:0,style:{padding:"48px"},children:e.jsx(r,{...p})})},n={args:{},render:()=>e.jsxs(c,{layer:0,style:{padding:"48px",display:"flex",flexDirection:"column",gap:"24px"},children:[e.jsx(r,{order:1,children:"H1 Title"}),e.jsx(r,{order:2,children:"H2 Title"}),e.jsx(r,{order:3,children:"H3 Title"}),e.jsx(r,{order:4,children:"H4 Title"}),e.jsx(r,{order:5,children:"H5 Title"}),e.jsx(r,{order:6,children:"H6 Title"})]})};var i,a,o;t.parameters={...t.parameters,docs:{...(i=t.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    order: 1,
    children: "Semantic H1 Document Boundary"
  },
  render: ({
    ...args
  }) => <Layer layer={0} style={{
    padding: "48px"
  }}>
      <Title {...args} />
    </Layer>
}`,...(o=(a=t.parameters)==null?void 0:a.docs)==null?void 0:o.source}}};var s,l,d;n.parameters={...n.parameters,docs:{...(s=n.parameters)==null?void 0:s.docs,source:{originalSource:`{
  args: {},
  render: () => <Layer layer={0} style={{
    padding: "48px",
    display: "flex",
    flexDirection: "column",
    gap: "24px"
  }}>
      <Title order={1}>H1 Title</Title>
      <Title order={2}>H2 Title</Title>
      <Title order={3}>H3 Title</Title>
      <Title order={4}>H4 Title</Title>
      <Title order={5}>H5 Title</Title>
      <Title order={6}>H6 Title</Title>
    </Layer>
}`,...(d=(l=n.parameters)==null?void 0:l.docs)==null?void 0:d.source}}};const y=["Default","StaticVariations"];export{t as Default,n as StaticVariations,y as __namedExportsOrder,u as default};

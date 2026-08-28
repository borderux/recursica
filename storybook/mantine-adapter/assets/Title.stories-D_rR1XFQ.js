import{j as e}from"./iframe-fFu_mAap.js";import{T as r}from"./Title-DeRb5DvV.js";import"./preload-helper-Dp1pzeXC.js";import"./factory-Mi9ZIq_V.js";const g={title:"UI-Kit/Title",component:r,tags:["autodocs"],parameters:{docs:{description:{component:"The semantic `<Title>` abstraction intrinsically links pure `h1-h6` tag generation with exact Recursica design boundaries to preserve SEO and screen reader trees uniformly globally."}}},argTypes:{order:{control:"select",options:[1,2,3,4,5,6],description:"Controls the `h` tag and the resultant typographical weighting natively mapped to Recursica."}}},t={args:{order:1,children:"Semantic H1 Document Boundary"},render:({...c})=>e.jsx(r,{...c})},i={args:{},render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"24px"},children:[e.jsx(r,{order:1,children:"H1 Title"}),e.jsx(r,{order:2,children:"H2 Title"}),e.jsx(r,{order:3,children:"H3 Title"}),e.jsx(r,{order:4,children:"H4 Title"}),e.jsx(r,{order:5,children:"H5 Title"}),e.jsx(r,{order:6,children:"H6 Title"})]})};var n,o,a;t.parameters={...t.parameters,docs:{...(n=t.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    order: 1,
    children: "Semantic H1 Document Boundary"
  },
  render: ({
    ...args
  }) => <Title {...args} />
}`,...(a=(o=t.parameters)==null?void 0:o.docs)==null?void 0:a.source}}};var s,l,d;i.parameters={...i.parameters,docs:{...(s=i.parameters)==null?void 0:s.docs,source:{originalSource:`{
  args: {},
  render: () => <div style={{
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
    </div>
}`,...(d=(l=i.parameters)==null?void 0:l.docs)==null?void 0:d.source}}};const x=["Default","StaticVariations"];export{t as Default,i as StaticVariations,x as __namedExportsOrder,g as default};

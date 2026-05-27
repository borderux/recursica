import{j as e,$ as c}from"./iframe-C_ymJL69.js";import{T as r}from"./Title-Dkl6bNj8.js";import"./preload-helper-Dp1pzeXC.js";import"./Typography-m9pV2k3Z.js";import"./Typography-B__wrBSG.js";import"./memoTheme-DuK-uO2q.js";import"./styled-CVDphjR5.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./generateUtilityClass-BtcU_pBl.js";import"./generateUtilityClasses-DDbjFgb8.js";const S={title:"UI-Kit/Title",component:r,tags:["autodocs"],parameters:{docs:{description:{component:"The semantic `<Title>` abstraction intrinsically links pure `h1-h6` tag generation with exact Recursica design boundaries to preserve SEO and screen reader trees uniformly globally."}},controls:{include:["layer","withLayer","order","children","component","variant","size","icon","disabled","href","onClick","onChange","value","checked"]}},argTypes:{order:{control:"select",options:[1,2,3,4,5,6],description:"Controls the `h` tag and the resultant typographical weighting natively mapped to Recursica."}}},t={args:{order:1,children:"Semantic H1 Document Boundary"},render:({...p})=>e.jsx(c,{layer:0,style:{padding:"48px"},children:e.jsx(r,{...p})})},i={args:{},render:()=>e.jsxs(c,{layer:0,style:{padding:"48px",display:"flex",flexDirection:"column",gap:"24px"},children:[e.jsx(r,{order:1,children:"H1 Title"}),e.jsx(r,{order:2,children:"H2 Title"}),e.jsx(r,{order:3,children:"H3 Title"}),e.jsx(r,{order:4,children:"H4 Title"}),e.jsx(r,{order:5,children:"H5 Title"}),e.jsx(r,{order:6,children:"H6 Title"})]})};var n,a,o;t.parameters={...t.parameters,docs:{...(n=t.parameters)==null?void 0:n.docs,source:{originalSource:`{
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
}`,...(o=(a=t.parameters)==null?void 0:a.docs)==null?void 0:o.source}}};var l,s,d;i.parameters={...i.parameters,docs:{...(l=i.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
}`,...(d=(s=i.parameters)==null?void 0:s.docs)==null?void 0:d.source}}};const D=["Default","StaticVariations"];export{t as Default,i as StaticVariations,D as __namedExportsOrder,S as default};

import{j as e,$ as c}from"./iframe-C_ymJL69.js";import{T as a}from"./Text-DX1OY5C-.js";import"./preload-helper-Dp1pzeXC.js";import"./Typography-m9pV2k3Z.js";import"./Typography-B__wrBSG.js";import"./memoTheme-DuK-uO2q.js";import"./styled-CVDphjR5.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./generateUtilityClass-BtcU_pBl.js";import"./generateUtilityClasses-DDbjFgb8.js";const S={title:"UI-Kit/Text",component:a,tags:["autodocs"],parameters:{docs:{description:{component:"The standard `<Text>` component controls common body sizing scales and implicit paragraphs governed by the active theme layer. For semantic headings (`h1` through `h6`), use `<Title>` instead."}},controls:{include:["layer","withLayer","variant","children","component","size","icon","disabled","href","onClick","onChange","value","checked"]}},argTypes:{variant:{control:"select",options:["body","body-small","caption","overline","subtitle","subtitle-small"],description:"Controls the standard logical boundary definitions natively extracted from Figma."}}},t={args:{variant:"body",children:"This is standard body typography controlled by the central UI-kit boundaries exclusively."},render:({...p})=>e.jsx(c,{layer:0,style:{padding:"48px"},children:e.jsx(a,{...p})})},r={args:{},render:()=>e.jsxs(c,{layer:0,style:{padding:"48px",display:"flex",flexDirection:"column",gap:"16px"},children:[e.jsx(a,{variant:"body",children:"Body (Base paragraph and generic information flow)"}),e.jsx(a,{variant:"body-small",children:"Body Small (Compacted list items and helper blocks)"}),e.jsx(a,{variant:"caption",children:"Caption (Data table descriptions or micro-labels)"}),e.jsx(a,{variant:"overline",children:"Overline (Card contextual pre-headers and categorical tags)"}),e.jsx(a,{variant:"subtitle",children:"Subtitle (Minor sub-headers avoiding heavy display weights)"}),e.jsx(a,{variant:"subtitle-small",children:"Subtitle Small (Section anchors deep in hierarchy)"})]})};var n,i,o;t.parameters={...t.parameters,docs:{...(n=t.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    variant: "body",
    children: "This is standard body typography controlled by the central UI-kit boundaries exclusively."
  },
  render: ({
    ...args
  }) => <Layer layer={0} style={{
    padding: "48px"
  }}>
      <Text {...args} />
    </Layer>
}`,...(o=(i=t.parameters)==null?void 0:i.docs)==null?void 0:o.source}}};var s,l,d;r.parameters={...r.parameters,docs:{...(s=r.parameters)==null?void 0:s.docs,source:{originalSource:`{
  args: {},
  render: () => <Layer layer={0} style={{
    padding: "48px",
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  }}>
      <Text variant="body">
        Body (Base paragraph and generic information flow)
      </Text>
      <Text variant="body-small">
        Body Small (Compacted list items and helper blocks)
      </Text>
      <Text variant="caption">
        Caption (Data table descriptions or micro-labels)
      </Text>
      <Text variant="overline">
        Overline (Card contextual pre-headers and categorical tags)
      </Text>
      <Text variant="subtitle">
        Subtitle (Minor sub-headers avoiding heavy display weights)
      </Text>
      <Text variant="subtitle-small">
        Subtitle Small (Section anchors deep in hierarchy)
      </Text>
    </Layer>
}`,...(d=(l=r.parameters)==null?void 0:l.docs)==null?void 0:d.source}}};const j=["Default","StaticVariations"];export{t as Default,r as StaticVariations,j as __namedExportsOrder,S as default};

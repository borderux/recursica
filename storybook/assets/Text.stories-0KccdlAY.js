import{j as e,$ as c}from"./iframe-d8_mgu_F.js";import{T as a}from"./Text-Bt36CO3M.js";import"./preload-helper-Dp1pzeXC.js";import"./Text-D5Ei7a1m.js";import"./get-size-J7CBMG80.js";import"./factory-BnxMGGpV.js";import"./polymorphic-factory-D_h49hYh.js";const v={title:"UI-Kit/Text",component:a,tags:["autodocs"],parameters:{docs:{description:{component:"The standard `<Text>` component controls common body sizing scales and implicit paragraphs governed by the active theme layer. For semantic headings (`h1` through `h6`), use `<Title>` instead."}}},argTypes:{variant:{control:"select",options:["body","body-small","caption","overline","subtitle","subtitle-small"],description:"Controls the standard logical boundary definitions natively extracted from Figma."},c:{control:"text",description:"Standard Mantine color string mapped via internal boundaries. Example: `dimmed`"}}},t={args:{variant:"body",children:"This is standard body typography controlled by the central UI-kit boundaries exclusively."},render:({...p})=>e.jsx(c,{layer:0,style:{padding:"48px"},children:e.jsx(a,{...p})})},n={args:{},render:()=>e.jsxs(c,{layer:0,style:{padding:"48px",display:"flex",flexDirection:"column",gap:"16px"},children:[e.jsx(a,{variant:"body",children:"Body (Base paragraph and generic information flow)"}),e.jsx(a,{variant:"body-small",children:"Body Small (Compacted list items and helper blocks)"}),e.jsx(a,{variant:"caption",children:"Caption (Data table descriptions or micro-labels)"}),e.jsx(a,{variant:"overline",children:"Overline (Card contextual pre-headers and categorical tags)"}),e.jsx(a,{variant:"subtitle",children:"Subtitle (Minor sub-headers avoiding heavy display weights)"}),e.jsx(a,{variant:"subtitle-small",children:"Subtitle Small (Section anchors deep in hierarchy)"})]})};var r,i,o;t.parameters={...t.parameters,docs:{...(r=t.parameters)==null?void 0:r.docs,source:{originalSource:`{
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
}`,...(o=(i=t.parameters)==null?void 0:i.docs)==null?void 0:o.source}}};var s,l,d;n.parameters={...n.parameters,docs:{...(s=n.parameters)==null?void 0:s.docs,source:{originalSource:`{
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
}`,...(d=(l=n.parameters)==null?void 0:l.docs)==null?void 0:d.source}}};const T=["Default","StaticVariations"];export{t as Default,n as StaticVariations,T as __namedExportsOrder,v as default};

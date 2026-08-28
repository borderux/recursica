import{j as e}from"./iframe-Bain31R0.js";import{T as a}from"./Text-CUJ035ww.js";import"./preload-helper-Dp1pzeXC.js";import"./Typography-BGTTj58W.js";import"./Typography-C3t9DkQB.js";import"./memoTheme-C8oOPpFq.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./generateUtilityClasses-DGi4yQgU.js";const v={title:"UI-Kit/Text",component:a,tags:["autodocs"],parameters:{docs:{description:{component:"The standard `<Text>` component controls common body sizing scales and implicit paragraphs governed by the active theme layer. For semantic headings (`h1` through `h6`), use `<Heading>` instead."}}},argTypes:{variant:{control:"select",options:["body","body-small","caption","overline","subtitle","subtitle-small"],description:"Controls the standard logical boundary definitions natively extracted from Figma."},c:{control:"text",description:"Standard Mantine color string mapped via internal boundaries. Example: `dimmed`"}}},t={args:{variant:"body",children:"This is standard body typography controlled by the central UI-kit boundaries exclusively."},render:({...c})=>e.jsx(a,{...c})},r={args:{},render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"24px"},children:[e.jsx(a,{variant:"body",children:"Body (Base paragraph and generic information flow)"}),e.jsx(a,{variant:"body-small",children:"Body Small (Compacted list items and helper blocks)"}),e.jsx(a,{variant:"caption",children:"Caption (Data table descriptions or micro-labels)"}),e.jsx(a,{variant:"overline",children:"Overline (Card contextual pre-headers and categorical tags)"}),e.jsx(a,{variant:"subtitle",children:"Subtitle (Minor sub-headers avoiding heavy display weights)"}),e.jsx(a,{variant:"subtitle-small",children:"Subtitle Small (Section anchors deep in hierarchy)"})]})};var n,i,o;t.parameters={...t.parameters,docs:{...(n=t.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    variant: "body",
    children: "This is standard body typography controlled by the central UI-kit boundaries exclusively."
  },
  render: ({
    ...args
  }) => <Text {...args} />
}`,...(o=(i=t.parameters)==null?void 0:i.docs)==null?void 0:o.source}}};var s,l,d;r.parameters={...r.parameters,docs:{...(s=r.parameters)==null?void 0:s.docs,source:{originalSource:`{
  args: {},
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "24px"
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
    </div>
}`,...(d=(l=r.parameters)==null?void 0:l.docs)==null?void 0:d.source}}};const T=["Default","StaticVariations"];export{t as Default,r as StaticVariations,T as __namedExportsOrder,v as default};

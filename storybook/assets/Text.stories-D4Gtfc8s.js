import{r as T,n as f,j as a,$ as x}from"./iframe-Cfrmv-sD.js";import{T as S}from"./Text-DGVryc-k.js";import"./preload-helper-Dp1pzeXC.js";import"./get-size-0ZAaIumh.js";import"./factory-B3pmeTAA.js";import"./polymorphic-factory-F4O7v52k.js";const e=T.forwardRef(function({overStyled:u=!1,variant:h="body",...g},b){const i=f(g,u),s=i.className,o=`recursica_brand_typography_${h}`,v=s?`${o} ${s}`:o;return a.jsx(S,{ref:b,className:v,...i})});e.displayName="Text";try{e.displayName="Text",e.__docgenInfo={description:"A generalized typographical wrapper limiting text properties to bounded Recursica UI-kit tokens inherently.\nDo not use for semantic headings; use the explicit `<Title>` component for `<h1>` - `<h6>`.",displayName:"Text",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Text/Text.tsx",methods:[],props:{variant:{defaultValue:{value:"body"},declarations:[{fileName:"mantine-adapter/src/components/Text/Text.tsx",name:"TypeLiteral"},{fileName:"mantine-adapter/src/components/Text/Text.tsx",name:"TypeLiteral"}],description:"The explicit typography hierarchy dictated by Recursica's global design tokens.",name:"variant",required:!1,tags:{},type:{name:"enum",raw:"TextVariant | undefined",value:[{value:"undefined"},{value:'"body"'},{value:'"caption"'},{value:'"overline"'},{value:'"body-small"'},{value:'"subtitle"'},{value:'"subtitle-small"'}]}}},tags:{}}}catch{}const D={title:"UI-Kit/Text",component:e,tags:["autodocs"],parameters:{docs:{description:{component:"The standard `<Text>` component controls common body sizing scales and implicit paragraphs governed by the active theme layer. For semantic headings (`h1` through `h6`), use `<Title>` instead."}}},argTypes:{variant:{control:"select",options:["body","body-small","caption","overline","subtitle","subtitle-small"],description:"Controls the standard logical boundary definitions natively extracted from Figma."},c:{control:"text",description:"Standard Mantine color string mapped via internal boundaries. Example: `dimmed`"}}},t={args:{variant:"body",children:"This is standard body typography controlled by the central UI-kit boundaries exclusively."},render:({...n})=>a.jsx(x,{layer:0,style:{padding:"48px"},children:a.jsx(e,{...n})})},r={args:{},render:()=>a.jsxs(x,{layer:0,style:{padding:"48px",display:"flex",flexDirection:"column",gap:"16px"},children:[a.jsx(e,{variant:"body",children:"Body (Base paragraph and generic information flow)"}),a.jsx(e,{variant:"body-small",children:"Body Small (Compacted list items and helper blocks)"}),a.jsx(e,{variant:"caption",children:"Caption (Data table descriptions or micro-labels)"}),a.jsx(e,{variant:"overline",children:"Overline (Card contextual pre-headers and categorical tags)"}),a.jsx(e,{variant:"subtitle",children:"Subtitle (Minor sub-headers avoiding heavy display weights)"}),a.jsx(e,{variant:"subtitle-small",children:"Subtitle Small (Section anchors deep in hierarchy)"})]})};var l,d,c;t.parameters={...t.parameters,docs:{...(l=t.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
}`,...(c=(d=t.parameters)==null?void 0:d.docs)==null?void 0:c.source}}};var p,m,y;r.parameters={...r.parameters,docs:{...(p=r.parameters)==null?void 0:p.docs,source:{originalSource:`{
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
}`,...(y=(m=r.parameters)==null?void 0:m.docs)==null?void 0:y.source}}};const B=["Default","StaticVariations"];export{t as Default,r as StaticVariations,B as __namedExportsOrder,D as default};

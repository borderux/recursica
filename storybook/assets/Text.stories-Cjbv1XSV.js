import{r as v,j as a}from"./iframe-uF_HBlgp.js";import{f as T}from"./filterStylingProps-Cd5Jg4Cp.js";import{T as S}from"./Text-B8vec1IY.js";import{T as y}from"./adapter-common-DIDtRk04.js";import"./preload-helper-Dp1pzeXC.js";import"./get-size-CyTqK_sX.js";import"./factory-DPW3mWUw.js";import"./polymorphic-factory-CALd9GjX.js";const e=v.forwardRef(function({overStyled:x=!1,variant:g="body",...h},f){const i=T(h,x),s=i.className,l=`recursica_brand_typography_${g}`,b=s?`${l} ${s}`:l;return a.jsx(S,{ref:f,className:b,...i})});e.displayName="Text";try{e.displayName="Text",e.__docgenInfo={description:"A generalized typographical wrapper limiting text properties to bounded Recursica UI-kit tokens inherently.\nDo not use for semantic headings; use the explicit `<Title>` component for `<h1>` - `<h6>`.",displayName:"Text",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Text/Text.tsx",methods:[],props:{variant:{defaultValue:{value:"body"},declarations:[{fileName:"mantine-adapter/src/components/Text/Text.tsx",name:"TypeLiteral"},{fileName:"mantine-adapter/src/components/Text/Text.tsx",name:"TypeLiteral"}],description:"The explicit typography hierarchy dictated by Recursica's global design tokens.",name:"variant",required:!1,tags:{},type:{name:"enum",raw:"TextVariant | undefined",value:[{value:"undefined"},{value:'"body"'},{value:'"caption"'},{value:'"overline"'},{value:'"body-small"'},{value:'"subtitle"'},{value:'"subtitle-small"'}]}},bdw:{defaultValue:null,description:"",name:"bdw",required:!1,tags:{},type:{name:"undefined"}},bds:{defaultValue:null,description:"",name:"bds",required:!1,tags:{},type:{name:"undefined"}},bdc:{defaultValue:null,description:"",name:"bdc",required:!1,tags:{},type:{name:"undefined"}},bdr:{defaultValue:null,description:"",name:"bdr",required:!1,tags:{},type:{name:"undefined"}},shadow:{defaultValue:null,description:"",name:"shadow",required:!1,tags:{},type:{name:"undefined"}},overStyled:{defaultValue:{value:"false"},declarations:[{fileName:"mantine-adapter/src/utils/filterStylingProps.ts",name:"TypeLiteral"},{fileName:"mantine-adapter/src/utils/filterStylingProps.ts",name:"TypeLiteral"}],description:"",name:"overStyled",required:!1,tags:{},type:{name:"boolean | undefined"}}},tags:{}}}catch{}const q={title:"UI-Kit/Text",component:e,tags:["autodocs"],parameters:{docs:{description:{component:"The standard `<Text>` component controls common body sizing scales and implicit paragraphs governed by the active theme layer. For semantic headings (`h1` through `h6`), use `<Title>` instead."}}},argTypes:{variant:{control:"select",options:["body","body-small","caption","overline","subtitle","subtitle-small"],description:"Controls the standard logical boundary definitions natively extracted from Figma."},c:{control:"text",description:"Standard Mantine color string mapped via internal boundaries. Example: `dimmed`"}}},t={args:{variant:"body",children:"This is standard body typography controlled by the central UI-kit boundaries exclusively."},render:({...r})=>a.jsx(y,{layer:0,style:{padding:"48px"},children:a.jsx(e,{...r})})},n={args:{},render:()=>a.jsxs(y,{layer:0,style:{padding:"48px",display:"flex",flexDirection:"column",gap:"16px"},children:[a.jsx(e,{variant:"body",children:"Body (Base paragraph and generic information flow)"}),a.jsx(e,{variant:"body-small",children:"Body Small (Compacted list items and helper blocks)"}),a.jsx(e,{variant:"caption",children:"Caption (Data table descriptions or micro-labels)"}),a.jsx(e,{variant:"overline",children:"Overline (Card contextual pre-headers and categorical tags)"}),a.jsx(e,{variant:"subtitle",children:"Subtitle (Minor sub-headers avoiding heavy display weights)"}),a.jsx(e,{variant:"subtitle-small",children:"Subtitle Small (Section anchors deep in hierarchy)"})]})};var o,d,c;t.parameters={...t.parameters,docs:{...(o=t.parameters)==null?void 0:o.docs,source:{originalSource:`{
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
}`,...(c=(d=t.parameters)==null?void 0:d.docs)==null?void 0:c.source}}};var p,m,u;n.parameters={...n.parameters,docs:{...(p=n.parameters)==null?void 0:p.docs,source:{originalSource:`{
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
}`,...(u=(m=n.parameters)==null?void 0:m.docs)==null?void 0:u.source}}};const D=["Default","StaticVariations"];export{t as Default,n as StaticVariations,D as __namedExportsOrder,q as default};

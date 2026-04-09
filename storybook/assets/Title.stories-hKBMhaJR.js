import{r as b,j as r}from"./iframe-uF_HBlgp.js";import{f as v}from"./filterStylingProps-Cd5Jg4Cp.js";import{T as H}from"./Title-BiG8fovV.js";import{T as f}from"./adapter-common-DIDtRk04.js";import"./preload-helper-Dp1pzeXC.js";import"./factory-DPW3mWUw.js";const e=b.forwardRef(function({overStyled:g=!1,order:i=1,...T},h){const s=v(T,g),l=s.className,o=`recursica_brand_typography_h${i}`,x=l?`${o} ${l}`:o;return r.jsx(H,{ref:h,order:i,className:x,...s})});e.displayName="Title";try{e.displayName="Title",e.__docgenInfo={description:"Enforces highly accessible structural markup utilizing semantic `<h1>` through `<h6>` tags securely bound directly to Recursica typographic scales.",displayName:"Title",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Title/Title.tsx",methods:[],props:{order:{defaultValue:{value:"1"},declarations:[{fileName:"mantine-adapter/src/components/Title/Title.tsx",name:"TypeLiteral"},{fileName:"mantine-adapter/src/components/Title/Title.tsx",name:"TypeLiteral"}],description:"Enforces semantic HTML headers (h1-h6) cleanly bound to native typographic scaling variables in the design system.",name:"order",required:!1,tags:{},type:{name:"enum",raw:"1 | 2 | 3 | 4 | 5 | 6 | undefined",value:[{value:"undefined"},{value:"1"},{value:"2"},{value:"3"},{value:"4"},{value:"5"},{value:"6"}]}},bdw:{defaultValue:null,description:"",name:"bdw",required:!1,tags:{},type:{name:"undefined"}},bds:{defaultValue:null,description:"",name:"bds",required:!1,tags:{},type:{name:"undefined"}},bdc:{defaultValue:null,description:"",name:"bdc",required:!1,tags:{},type:{name:"undefined"}},bdr:{defaultValue:null,description:"",name:"bdr",required:!1,tags:{},type:{name:"undefined"}},shadow:{defaultValue:null,description:"",name:"shadow",required:!1,tags:{},type:{name:"undefined"}},overStyled:{defaultValue:{value:"false"},declarations:[{fileName:"mantine-adapter/src/utils/filterStylingProps.ts",name:"TypeLiteral"},{fileName:"mantine-adapter/src/utils/filterStylingProps.ts",name:"TypeLiteral"}],description:"",name:"overStyled",required:!1,tags:{},type:{name:"boolean | undefined"}}},tags:{}}}catch{}const V={title:"UI-Kit/Title",component:e,tags:["autodocs"],parameters:{docs:{description:{component:"The semantic `<Title>` abstraction intrinsically links pure `h1-h6` tag generation with exact Recursica design boundaries to preserve SEO and screen reader trees uniformly globally."}}},argTypes:{order:{control:"select",options:[1,2,3,4,5,6],description:"Controls the `h` tag and the resultant typographical weighting natively mapped to Recursica."}}},a={args:{order:1,children:"Semantic H1 Document Boundary"},render:({...n})=>r.jsx(f,{layer:0,style:{padding:"48px"},children:r.jsx(e,{...n})})},t={args:{},render:()=>r.jsxs(f,{layer:0,style:{padding:"48px",display:"flex",flexDirection:"column",gap:"24px"},children:[r.jsx(e,{order:1,children:"H1 Title"}),r.jsx(e,{order:2,children:"H2 Title"}),r.jsx(e,{order:3,children:"H3 Title"}),r.jsx(e,{order:4,children:"H4 Title"}),r.jsx(e,{order:5,children:"H5 Title"}),r.jsx(e,{order:6,children:"H6 Title"})]})};var d,c,p;a.parameters={...a.parameters,docs:{...(d=a.parameters)==null?void 0:d.docs,source:{originalSource:`{
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
}`,...(p=(c=a.parameters)==null?void 0:c.docs)==null?void 0:p.source}}};var u,m,y;t.parameters={...t.parameters,docs:{...(u=t.parameters)==null?void 0:u.docs,source:{originalSource:`{
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
}`,...(y=(m=t.parameters)==null?void 0:m.docs)==null?void 0:y.source}}};const q=["Default","StaticVariations"];export{a as Default,t as StaticVariations,q as __namedExportsOrder,V as default};

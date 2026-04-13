import{r as H,n as _,j as r,$ as y}from"./iframe-Cfrmv-sD.js";import{T as v}from"./Title-BqYgc0Ob.js";import"./preload-helper-Dp1pzeXC.js";import"./factory-B3pmeTAA.js";const e=H.forwardRef(function({overStyled:g=!1,order:n=1,...h},f){const s=_(h,g),l=s.className,o=`recursica_brand_typography_h${n}`,x=l?`${o} ${l}`:o;return r.jsx(v,{ref:f,order:n,className:x,...s})});e.displayName="Title";try{e.displayName="Title",e.__docgenInfo={description:"Enforces highly accessible structural markup utilizing semantic `<h1>` through `<h6>` tags securely bound directly to Recursica typographic scales.",displayName:"Title",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Title/Title.tsx",methods:[],props:{defaultChecked:{defaultValue:null,declarations:[{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"},{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"}],description:"",name:"defaultChecked",parent:{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"},required:!1,tags:{},type:{name:"boolean | undefined"}},order:{defaultValue:{value:"1"},declarations:[{fileName:"mantine-adapter/src/components/Title/Title.tsx",name:"TypeLiteral"},{fileName:"mantine-adapter/src/components/Title/Title.tsx",name:"TypeLiteral"}],description:"Enforces semantic HTML headers (h1-h6) cleanly bound to native typographic scaling variables in the design system.",name:"order",required:!1,tags:{},type:{name:"enum",raw:"1 | 2 | 3 | 4 | 5 | 6 | undefined",value:[{value:"undefined"},{value:"1"},{value:"2"},{value:"3"},{value:"4"},{value:"5"},{value:"6"}]}}},tags:{}}}catch{}const S={title:"UI-Kit/Title",component:e,tags:["autodocs"],parameters:{docs:{description:{component:"The semantic `<Title>` abstraction intrinsically links pure `h1-h6` tag generation with exact Recursica design boundaries to preserve SEO and screen reader trees uniformly globally."}}},argTypes:{order:{control:"select",options:[1,2,3,4,5,6],description:"Controls the `h` tag and the resultant typographical weighting natively mapped to Recursica."}}},t={args:{order:1,children:"Semantic H1 Document Boundary"},render:({...i})=>r.jsx(y,{layer:0,style:{padding:"48px"},children:r.jsx(e,{...i})})},a={args:{},render:()=>r.jsxs(y,{layer:0,style:{padding:"48px",display:"flex",flexDirection:"column",gap:"24px"},children:[r.jsx(e,{order:1,children:"H1 Title"}),r.jsx(e,{order:2,children:"H2 Title"}),r.jsx(e,{order:3,children:"H3 Title"}),r.jsx(e,{order:4,children:"H4 Title"}),r.jsx(e,{order:5,children:"H5 Title"}),r.jsx(e,{order:6,children:"H6 Title"})]})};var c,d,p;t.parameters={...t.parameters,docs:{...(c=t.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
}`,...(p=(d=t.parameters)==null?void 0:d.docs)==null?void 0:p.source}}};var u,m,T;a.parameters={...a.parameters,docs:{...(u=a.parameters)==null?void 0:u.docs,source:{originalSource:`{
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
}`,...(T=(m=a.parameters)==null?void 0:m.docs)==null?void 0:T.source}}};const k=["Default","StaticVariations"];export{t as Default,a as StaticVariations,k as __namedExportsOrder,S as default};

import{r as c,j as s}from"./iframe-uF_HBlgp.js";import{f as z}from"./filterStylingProps-Cd5Jg4Cp.js";import{e as F}from"./get-size-CyTqK_sX.js";import{f as H,u as K,b as M,B as P,c as O}from"./factory-DPW3mWUw.js";import{T as X}from"./adapter-common-DIDtRk04.js";import"./preload-helper-Dp1pzeXC.js";function G(e){return Array.isArray(e)||e===null?!1:typeof e=="object"?e.type!==c.Fragment:!1}var I={root:"m_8b3717df",breadcrumb:"m_f678d540",separator:"m_3b8f2208"};const J={separator:"/"},Q=O((e,{separatorMargin:r})=>({root:{"--bc-separator-margin":F(r)}})),x=H((e,r)=>{const m=K("Breadcrumbs",J,e),{classNames:_,className:l,style:d,styles:o,unstyled:p,vars:h,children:n,separator:A,separatorMargin:Z,attributes:R,...T}=m,i=M({name:"Breadcrumbs",classes:I,props:m,className:l,style:d,classNames:_,styles:o,unstyled:p,attributes:R,vars:h,varsResolver:Q}),L=c.Children.toArray(n).reduce((B,u,f,D)=>{var N;const U=G(u)?c.cloneElement(u,{...i("breadcrumb",{className:(N=u.props)==null?void 0:N.className}),key:f}):c.createElement("div",{...i("breadcrumb"),key:f},u);return B.push(U),f!==D.length-1&&B.push(c.createElement(P,{...i("separator"),key:`separator-${f}`},A)),B},[]);return s.jsx(P,{ref:r,...i("root"),...T,children:L})});x.classes=I;x.displayName="@mantine/core/Breadcrumbs";const W="Breadcrumb-module__root___x-9ln",Y="Breadcrumb-module__separator___qrUX-",a={root:W,separator:Y},t=c.forwardRef(function({overStyled:r=!1,...m},_){const l=z(m,r),d={root:a.root,separator:a.separator},o=l.classNames;if(o&&typeof o=="object"&&!Array.isArray(o)){const n=o;d.root=n.root?`${a.root} ${n.root}`:a.root,d.separator=n.separator?`${a.separator} ${n.separator}`:a.separator}const p=l.className,h=p?`${a.root} ${p}`:a.root;return s.jsx(x,{ref:_,...l,className:h,classNames:d})});t.displayName="Breadcrumb";try{t.displayName="Breadcrumb",t.__docgenInfo={description:"",displayName:"Breadcrumb",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Breadcrumb/Breadcrumb.tsx",methods:[],props:{bdw:{defaultValue:null,description:"",name:"bdw",required:!1,tags:{},type:{name:"undefined"}},bds:{defaultValue:null,description:"",name:"bds",required:!1,tags:{},type:{name:"undefined"}},bdc:{defaultValue:null,description:"",name:"bdc",required:!1,tags:{},type:{name:"undefined"}},bdr:{defaultValue:null,description:"",name:"bdr",required:!1,tags:{},type:{name:"undefined"}},shadow:{defaultValue:null,description:"",name:"shadow",required:!1,tags:{},type:{name:"undefined"}},overStyled:{defaultValue:{value:"false"},declarations:[{fileName:"mantine-adapter/src/utils/filterStylingProps.ts",name:"TypeLiteral"},{fileName:"mantine-adapter/src/utils/filterStylingProps.ts",name:"TypeLiteral"}],description:"",name:"overStyled",required:!1,tags:{},type:{name:"boolean | undefined"}}},tags:{}}}catch{}const ne={title:"UI-Kit/Breadcrumb",component:t,tags:["autodocs"],argTypes:{layer:{control:"radio",options:[0,1,2,3],description:"The design system layer context",table:{category:"Story Controls"}},separator:{control:"text",description:"Custom separator between items"}}},S=[{title:"Home",href:"#"},{title:"Components",href:"#"},{title:"Breadcrumb",href:"#"}].map((e,r)=>s.jsx("a",{href:e.href,style:{color:"var(--recursica_brand_palettes_primary_default_color_tone)",textDecoration:"none"},children:e.title},r)),y={args:{children:S,layer:0},render:({layer:e=0,...r})=>s.jsx(X,{layer:e,style:{padding:"24px"},children:s.jsx(t,{...r})})},b={args:{children:S},render:e=>s.jsx(t,{...e})},g={args:{children:S,separator:"→"},render:e=>s.jsx(t,{...e})};var j,k,C;y.parameters={...y.parameters,docs:{...(j=y.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    children: mockItems,
    layer: 0
  },
  render: ({
    layer = 0,
    ...args
  }) => {
    return <Layer layer={layer as 0 | 1 | 2 | 3} style={{
      padding: "24px"
    }}>
        <Breadcrumb {...args as React.ComponentProps<typeof Breadcrumb>} />
      </Layer>;
  }
}`,...(C=(k=y.parameters)==null?void 0:k.docs)==null?void 0:C.source}}};var E,q,v;b.parameters={...b.parameters,docs:{...(E=b.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    children: mockItems
  },
  render: (args: BreadcrumbStoryProps) => <Breadcrumb {...args} />
}`,...(v=(q=b.parameters)==null?void 0:q.docs)==null?void 0:v.source}}};var w,V,$;g.parameters={...g.parameters,docs:{...(w=g.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    children: mockItems,
    separator: "→"
  },
  render: (args: BreadcrumbStoryProps) => <Breadcrumb {...args} />
}`,...($=(V=g.parameters)==null?void 0:V.docs)==null?void 0:$.source}}};const ce=["Default","StaticExample","CustomSeparator"];export{g as CustomSeparator,y as Default,b as StaticExample,ce as __namedExportsOrder,ne as default};

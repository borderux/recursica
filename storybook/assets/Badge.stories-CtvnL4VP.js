import{j as r,m as Y,r as Z,f as ee,$ as ae}from"./iframe-BlyjOLeZ.js";import{u as re,d as se,B as oe,e as te,c as ne}from"./factory-DLKEpXnh.js";import{b as ce,g as x}from"./get-size-AZBW9FMn.js";import{p as ie}from"./polymorphic-factory-CAKH0E_l.js";import"./preload-helper-Dp1pzeXC.js";var F={root:"m_347db0ec","root--dot":"m_fbd81e3d",label:"m_5add502a",section:"m_91fdda9b"};const de=te((e,{radius:l,color:a,gradient:p,variant:s,size:o,autoContrast:c,circle:i})=>{const d=e.variantColorResolver({color:a||e.primaryColor,theme:e,gradient:p,variant:s||"filled",autoContrast:c});return{root:{"--badge-height":x(o,"badge-height"),"--badge-padding-x":x(o,"badge-padding-x"),"--badge-fz":x(o,"badge-fz"),"--badge-radius":i||l===void 0?void 0:ce(l),"--badge-bg":a||s?d.background:void 0,"--badge-color":a||s?d.color:void 0,"--badge-bd":a||s?d.border:void 0,"--badge-dot-color":s==="dot"?Y(a,e):void 0}}}),_=ie((e,l)=>{const a=re("Badge",null,e),{classNames:p,className:s,style:o,styles:c,unstyled:i,vars:d,radius:N,color:m,gradient:pe,leftSection:v,rightSection:S,children:U,variant:P,fullWidth:G,autoContrast:me,circle:H,mod:J,attributes:Q,...X}=a,g=se({name:"Badge",props:a,classes:F,className:s,style:o,classNames:p,styles:c,unstyled:i,attributes:Q,vars:d,varsResolver:de});return r.jsxs(oe,{variant:P,mod:[{block:G,circle:H,"with-right-section":!!S,"with-left-section":!!v},J],...g("root",{variant:P}),ref:l,...X,children:[v&&r.jsx("span",{...g("section"),"data-position":"left",children:v}),r.jsx("span",{...g("label"),children:U}),S&&r.jsx("span",{...g("section"),"data-position":"right",children:S})]})});_.classes=F;_.displayName="@mantine/core/Badge";const le="Badge-module__root___5osNT",t={root:le},K=Z.forwardRef(function({variant:l="primary-color",overStyled:a=!1,...p},s){const o=ee(p,a),c={root:t.root,section:t.section,label:t.label},i=o.classNames;if(i&&typeof i=="object"&&!Array.isArray(i)){const m=i;c.root=m.root?`${t.root} ${m.root}`:t.root,c.section=m.section??t.section,c.label=m.label??t.label}const d=o.className,N=d?`${t.root} ${d}`:t.root;return r.jsx(_,{ref:s,variant:"filled","data-variant":l,...o,className:N,classNames:c})});K.displayName="Badge";const n=ne(K);try{n.displayName="Badge",n.__docgenInfo={description:"Recursica Badge component wrapping Mantine's Badge.\n\nSupports polymorphism via the `component` prop or `renderRoot` for custom element rendering.",displayName:"Badge",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Badge/Badge.tsx",methods:[],props:{variant:{defaultValue:{value:"primary-color"},declarations:[{fileName:"mantine-adapter/src/components/Badge/Badge.tsx",name:"RecursicaBadgeProps"},{fileName:"mantine-adapter/src/components/Badge/Badge.tsx",name:"RecursicaBadgeProps"}],description:"Map to the component styles defined in variables",name:"variant",parent:{fileName:"mantine-adapter/src/components/Badge/Badge.tsx",name:"RecursicaBadgeProps"},required:!1,tags:{},type:{name:"enum",raw:'"alert" | "primary-color" | "success" | "warning" | undefined',value:[{value:"undefined"},{value:'"alert"'},{value:'"primary-color"'},{value:'"success"'},{value:'"warning"'}]}},component:{defaultValue:null,declarations:[{fileName:"recursica/node_modules/@mantine/core/lib/core/factory/create-polymorphic-component.d.ts",name:"TypeLiteral"},{fileName:"recursica/node_modules/@mantine/core/lib/core/factory/create-polymorphic-component.d.ts",name:"TypeLiteral"}],description:"",name:"component",required:!1,tags:{},type:{name:'"symbol" | "object" | "style" | "p" | "td" | "button" | "text" | "small" | "a" | "abbr" | "address" | "area" | "article" | "aside" | "audio" | "b" | "base" | "bdi" | "bdo" | "big" | ... 160 more ... | undefined'}},renderRoot:{defaultValue:null,declarations:[{fileName:"recursica/node_modules/@mantine/core/lib/core/factory/create-polymorphic-component.d.ts",name:"TypeLiteral"},{fileName:"recursica/node_modules/@mantine/core/lib/core/factory/create-polymorphic-component.d.ts",name:"TypeLiteral"}],description:"",name:"renderRoot",required:!1,tags:{},type:{name:"((props: any) => any) | ((props: Record<string, any>) => any) | undefined"}}},tags:{}}}catch{}const Be={title:"UI-Kit/Badge",component:n,tags:["autodocs"],argTypes:{variant:{control:"select",options:["alert","primary-color","success","warning"],description:"The style / intent mapping for the badge"}}},u={args:{children:"Badge Label",variant:"primary-color"},render:({withLayer:e,layer:l,...a})=>r.jsx(n,{...a})},y={args:{children:"Alert Badge",variant:"alert"},render:e=>r.jsx(n,{...e})},f={args:{children:"Primary Badge",variant:"primary-color"},render:e=>r.jsx(n,{...e})},b={args:{children:"Success Badge",variant:"success"},render:e=>r.jsx(n,{...e})},B={args:{children:"Warning Badge",variant:"warning"},render:e=>r.jsx(n,{...e})},h={args:{children:"Layer 1 Alert",variant:"alert"},render:e=>r.jsx(ae,{layer:1,style:{padding:"24px"},children:r.jsx(n,{...e})})};var j,L,R;u.parameters={...u.parameters,docs:{...(j=u.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    children: "Badge Label",
    variant: "primary-color"
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => {
    return <Badge {...args} />;
  }
}`,...(R=(L=u.parameters)==null?void 0:L.docs)==null?void 0:R.source}}};var w,A,T;y.parameters={...y.parameters,docs:{...(w=y.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    children: "Alert Badge",
    variant: "alert"
  },
  render: (args: BadgeStoryProps) => <Badge {...args} />
}`,...(T=(A=y.parameters)==null?void 0:A.docs)==null?void 0:T.source}}};var C,$,W;f.parameters={...f.parameters,docs:{...(C=f.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    children: "Primary Badge",
    variant: "primary-color"
  },
  render: (args: BadgeStoryProps) => <Badge {...args} />
}`,...(W=($=f.parameters)==null?void 0:$.docs)==null?void 0:W.source}}};var k,V,q;b.parameters={...b.parameters,docs:{...(k=b.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    children: "Success Badge",
    variant: "success"
  },
  render: (args: BadgeStoryProps) => <Badge {...args} />
}`,...(q=(V=b.parameters)==null?void 0:V.docs)==null?void 0:q.source}}};var E,O,z;B.parameters={...B.parameters,docs:{...(E=B.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    children: "Warning Badge",
    variant: "warning"
  },
  render: (args: BadgeStoryProps) => <Badge {...args} />
}`,...(z=(O=B.parameters)==null?void 0:O.docs)==null?void 0:z.source}}};var D,I,M;h.parameters={...h.parameters,docs:{...(D=h.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    children: "Layer 1 Alert",
    variant: "alert"
  },
  render: (args: BadgeStoryProps) => <Layer layer={1} style={{
    padding: "24px"
  }}>
      <Badge {...args} />
    </Layer>
}`,...(M=(I=h.parameters)==null?void 0:I.docs)==null?void 0:M.source}}};const he=["Default","StaticAlert","StaticPrimary","StaticSuccess","StaticWarning","LayerOneAlert"];export{u as Default,h as LayerOneAlert,y as StaticAlert,f as StaticPrimary,b as StaticSuccess,B as StaticWarning,he as __namedExportsOrder,Be as default};

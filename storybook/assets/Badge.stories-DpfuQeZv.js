import{j as a,i as Y,r as Z}from"./iframe-uF_HBlgp.js";import{f as ee}from"./filterStylingProps-Cd5Jg4Cp.js";import{a as ae,d as x}from"./get-size-CyTqK_sX.js";import{u as re,b as se,B as te,c as ne}from"./factory-DPW3mWUw.js";import{p as oe}from"./polymorphic-factory-CALd9GjX.js";import{T as K}from"./adapter-common-DIDtRk04.js";import"./preload-helper-Dp1pzeXC.js";var M={root:"m_347db0ec","root--dot":"m_fbd81e3d",label:"m_5add502a",section:"m_91fdda9b"};const de=ne((e,{radius:d,color:r,gradient:g,variant:t,size:n,autoContrast:i,circle:c})=>{const l=e.variantColorResolver({color:r||e.primaryColor,theme:e,gradient:g,variant:t||"filled",autoContrast:i});return{root:{"--badge-height":x(n,"badge-height"),"--badge-padding-x":x(n,"badge-padding-x"),"--badge-fz":x(n,"badge-fz"),"--badge-radius":c||d===void 0?void 0:ae(d),"--badge-bg":r||t?l.background:void 0,"--badge-color":r||t?l.color:void 0,"--badge-bd":r||t?l.border:void 0,"--badge-dot-color":t==="dot"?Y(r,e):void 0}}}),P=oe((e,d)=>{const r=re("Badge",null,e),{classNames:g,className:t,style:n,styles:i,unstyled:c,vars:l,radius:N,color:p,gradient:ce,leftSection:h,rightSection:S,children:U,variant:_,fullWidth:G,autoContrast:le,circle:H,mod:J,attributes:Q,...X}=r,m=se({name:"Badge",props:r,classes:M,className:t,style:n,classNames:g,styles:i,unstyled:c,attributes:Q,vars:l,varsResolver:de});return a.jsxs(te,{variant:_,mod:[{block:G,circle:H,"with-right-section":!!S,"with-left-section":!!h},J],...m("root",{variant:_}),ref:d,...X,children:[h&&a.jsx("span",{...m("section"),"data-position":"left",children:h}),a.jsx("span",{...m("label"),children:U}),S&&a.jsx("span",{...m("section"),"data-position":"right",children:S})]})});P.classes=M;P.displayName="@mantine/core/Badge";const ie="Badge-module__root___5osNT",o={root:ie},s=Z.forwardRef(function({variant:d="primary-color",overStyled:r=!1,...g},t){const n=ee(g,r),i={root:o.root,section:o.section,label:o.label},c=n.classNames;if(c&&typeof c=="object"&&!Array.isArray(c)){const p=c;i.root=p.root?`${o.root} ${p.root}`:o.root,i.section=p.section??o.section,i.label=p.label??o.label}const l=n.className,N=l?`${o.root} ${l}`:o.root;return a.jsx(P,{ref:t,variant:"filled","data-variant":d,...n,className:N,classNames:i})});s.displayName="Badge";try{s.displayName="Badge",s.__docgenInfo={description:"",displayName:"Badge",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Badge/Badge.tsx",methods:[],props:{variant:{defaultValue:{value:"primary-color"},declarations:[{fileName:"mantine-adapter/src/components/Badge/Badge.tsx",name:"RecursicaBadgeProps"},{fileName:"mantine-adapter/src/components/Badge/Badge.tsx",name:"RecursicaBadgeProps"}],description:"Map to the component styles defined in variables",name:"variant",parent:{fileName:"mantine-adapter/src/components/Badge/Badge.tsx",name:"RecursicaBadgeProps"},required:!1,tags:{},type:{name:"enum",raw:'"alert" | "primary-color" | "success" | "warning" | undefined',value:[{value:"undefined"},{value:'"alert"'},{value:'"primary-color"'},{value:'"success"'},{value:'"warning"'}]}},bdw:{defaultValue:null,description:"",name:"bdw",required:!1,tags:{},type:{name:"undefined"}},bds:{defaultValue:null,description:"",name:"bds",required:!1,tags:{},type:{name:"undefined"}},bdc:{defaultValue:null,description:"",name:"bdc",required:!1,tags:{},type:{name:"undefined"}},bdr:{defaultValue:null,description:"",name:"bdr",required:!1,tags:{},type:{name:"undefined"}},shadow:{defaultValue:null,description:"",name:"shadow",required:!1,tags:{},type:{name:"undefined"}},overStyled:{defaultValue:{value:"false"},declarations:[{fileName:"mantine-adapter/src/utils/filterStylingProps.ts",name:"TypeLiteral"},{fileName:"mantine-adapter/src/utils/filterStylingProps.ts",name:"TypeLiteral"}],description:"",name:"overStyled",required:!1,tags:{},type:{name:"boolean | undefined"}}},tags:{}}}catch{}const be={title:"UI-Kit/Badge",component:s,tags:["autodocs"],argTypes:{variant:{control:"select",options:["alert","primary-color","success","warning"],description:"The style / intent mapping for the badge"},layer:{control:"radio",options:[0,1,2,3],description:"The design system layer context",table:{category:"Story Controls"}}}},u={args:{children:"Badge Label",variant:"primary-color",layer:0},render:({layer:e=0,...d})=>a.jsx(K,{layer:e,style:{padding:"24px"},children:a.jsx(s,{...d})})},y={args:{children:"Alert Badge",variant:"alert"},render:e=>a.jsx(s,{...e})},f={args:{children:"Primary Badge",variant:"primary-color"},render:e=>a.jsx(s,{...e})},B={args:{children:"Success Badge",variant:"success"},render:e=>a.jsx(s,{...e})},b={args:{children:"Warning Badge",variant:"warning"},render:e=>a.jsx(s,{...e})},v={args:{children:"Layer 1 Alert",variant:"alert"},render:e=>a.jsx(K,{layer:1,style:{padding:"24px"},children:a.jsx(s,{...e})})};var j,w,L;u.parameters={...u.parameters,docs:{...(j=u.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    children: "Badge Label",
    variant: "primary-color",
    layer: 0
  },
  render: ({
    layer = 0,
    ...args
  }) => {
    return <Layer layer={layer as 0 | 1 | 2 | 3} style={{
      padding: "24px"
    }}>
        <Badge {...args} />
      </Layer>;
  }
}`,...(L=(w=u.parameters)==null?void 0:w.docs)==null?void 0:L.source}}};var A,R,T;y.parameters={...y.parameters,docs:{...(A=y.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    children: "Alert Badge",
    variant: "alert"
  },
  render: (args: BadgeStoryProps) => <Badge {...args} />
}`,...(T=(R=y.parameters)==null?void 0:R.docs)==null?void 0:T.source}}};var V,q,C;f.parameters={...f.parameters,docs:{...(V=f.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    children: "Primary Badge",
    variant: "primary-color"
  },
  render: (args: BadgeStoryProps) => <Badge {...args} />
}`,...(C=(q=f.parameters)==null?void 0:q.docs)==null?void 0:C.source}}};var W,$,k;B.parameters={...B.parameters,docs:{...(W=B.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    children: "Success Badge",
    variant: "success"
  },
  render: (args: BadgeStoryProps) => <Badge {...args} />
}`,...(k=($=B.parameters)==null?void 0:$.docs)==null?void 0:k.source}}};var E,O,z;b.parameters={...b.parameters,docs:{...(E=b.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    children: "Warning Badge",
    variant: "warning"
  },
  render: (args: BadgeStoryProps) => <Badge {...args} />
}`,...(z=(O=b.parameters)==null?void 0:O.docs)==null?void 0:z.source}}};var D,I,F;v.parameters={...v.parameters,docs:{...(D=v.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    children: "Layer 1 Alert",
    variant: "alert"
  },
  render: (args: BadgeStoryProps) => <Layer layer={1} style={{
    padding: "24px"
  }}>
      <Badge {...args} />
    </Layer>
}`,...(F=(I=v.parameters)==null?void 0:I.docs)==null?void 0:F.source}}};const ve=["Default","StaticAlert","StaticPrimary","StaticSuccess","StaticWarning","LayerOneAlert"];export{u as Default,v as LayerOneAlert,y as StaticAlert,f as StaticPrimary,B as StaticSuccess,b as StaticWarning,ve as __namedExportsOrder,be as default};

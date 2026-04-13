import{j as a,k as X,r as Y,n as Z,$ as ee}from"./iframe-Cfrmv-sD.js";import{a as ae,d as x}from"./get-size-0ZAaIumh.js";import{u as re,b as se,B as te,c as oe}from"./factory-B3pmeTAA.js";import{p as ne}from"./polymorphic-factory-F4O7v52k.js";import"./preload-helper-Dp1pzeXC.js";var K={root:"m_347db0ec","root--dot":"m_fbd81e3d",label:"m_5add502a",section:"m_91fdda9b"};const ce=oe((e,{radius:l,color:r,gradient:g,variant:t,size:o,autoContrast:c,circle:d})=>{const i=e.variantColorResolver({color:r||e.primaryColor,theme:e,gradient:g,variant:t||"filled",autoContrast:c});return{root:{"--badge-height":x(o,"badge-height"),"--badge-padding-x":x(o,"badge-padding-x"),"--badge-fz":x(o,"badge-fz"),"--badge-radius":d||l===void 0?void 0:ae(l),"--badge-bg":r||t?i.background:void 0,"--badge-color":r||t?i.color:void 0,"--badge-bd":r||t?i.border:void 0,"--badge-dot-color":t==="dot"?X(r,e):void 0}}}),_=ne((e,l)=>{const r=re("Badge",null,e),{classNames:g,className:t,style:o,styles:c,unstyled:d,vars:i,radius:P,color:p,gradient:ie,leftSection:b,rightSection:S,children:M,variant:N,fullWidth:U,autoContrast:le,circle:G,mod:H,attributes:J,...Q}=r,m=se({name:"Badge",props:r,classes:K,className:t,style:o,classNames:g,styles:c,unstyled:d,attributes:J,vars:i,varsResolver:ce});return a.jsxs(te,{variant:N,mod:[{block:U,circle:G,"with-right-section":!!S,"with-left-section":!!b},H],...m("root",{variant:N}),ref:l,...Q,children:[b&&a.jsx("span",{...m("section"),"data-position":"left",children:b}),a.jsx("span",{...m("label"),children:M}),S&&a.jsx("span",{...m("section"),"data-position":"right",children:S})]})});_.classes=K;_.displayName="@mantine/core/Badge";const de="Badge-module__root___5osNT",n={root:de},s=Y.forwardRef(function({variant:l="primary-color",overStyled:r=!1,...g},t){const o=Z(g,r),c={root:n.root,section:n.section,label:n.label},d=o.classNames;if(d&&typeof d=="object"&&!Array.isArray(d)){const p=d;c.root=p.root?`${n.root} ${p.root}`:n.root,c.section=p.section??n.section,c.label=p.label??n.label}const i=o.className,P=i?`${n.root} ${i}`:n.root;return a.jsx(_,{ref:t,variant:"filled","data-variant":l,...o,className:P,classNames:c})});s.displayName="Badge";try{s.displayName="Badge",s.__docgenInfo={description:"",displayName:"Badge",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Badge/Badge.tsx",methods:[],props:{variant:{defaultValue:{value:"primary-color"},declarations:[{fileName:"mantine-adapter/src/components/Badge/Badge.tsx",name:"RecursicaBadgeProps"},{fileName:"mantine-adapter/src/components/Badge/Badge.tsx",name:"RecursicaBadgeProps"}],description:"Map to the component styles defined in variables",name:"variant",parent:{fileName:"mantine-adapter/src/components/Badge/Badge.tsx",name:"RecursicaBadgeProps"},required:!1,tags:{},type:{name:"enum",raw:'"alert" | "primary-color" | "success" | "warning" | undefined',value:[{value:"undefined"},{value:'"alert"'},{value:'"primary-color"'},{value:'"success"'},{value:'"warning"'}]}}},tags:{}}}catch{}const Be={title:"UI-Kit/Badge",component:s,tags:["autodocs"],argTypes:{variant:{control:"select",options:["alert","primary-color","success","warning"],description:"The style / intent mapping for the badge"}}},u={args:{children:"Badge Label",variant:"primary-color"},render:e=>a.jsx(s,{...e})},y={args:{children:"Alert Badge",variant:"alert"},render:e=>a.jsx(s,{...e})},B={args:{children:"Primary Badge",variant:"primary-color"},render:e=>a.jsx(s,{...e})},f={args:{children:"Success Badge",variant:"success"},render:e=>a.jsx(s,{...e})},v={args:{children:"Warning Badge",variant:"warning"},render:e=>a.jsx(s,{...e})},h={args:{children:"Layer 1 Alert",variant:"alert"},render:e=>a.jsx(ee,{layer:1,style:{padding:"24px"},children:a.jsx(s,{...e})})};var j,w,A;u.parameters={...u.parameters,docs:{...(j=u.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    children: "Badge Label",
    variant: "primary-color"
  },
  render: args => {
    return <Badge {...args} />;
  }
}`,...(A=(w=u.parameters)==null?void 0:w.docs)==null?void 0:A.source}}};var R,L,C;y.parameters={...y.parameters,docs:{...(R=y.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    children: "Alert Badge",
    variant: "alert"
  },
  render: (args: BadgeStoryProps) => <Badge {...args} />
}`,...(C=(L=y.parameters)==null?void 0:L.docs)==null?void 0:C.source}}};var $,k,W;B.parameters={...B.parameters,docs:{...($=B.parameters)==null?void 0:$.docs,source:{originalSource:`{
  args: {
    children: "Primary Badge",
    variant: "primary-color"
  },
  render: (args: BadgeStoryProps) => <Badge {...args} />
}`,...(W=(k=B.parameters)==null?void 0:k.docs)==null?void 0:W.source}}};var T,E,O;f.parameters={...f.parameters,docs:{...(T=f.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    children: "Success Badge",
    variant: "success"
  },
  render: (args: BadgeStoryProps) => <Badge {...args} />
}`,...(O=(E=f.parameters)==null?void 0:E.docs)==null?void 0:O.source}}};var z,D,I;v.parameters={...v.parameters,docs:{...(z=v.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    children: "Warning Badge",
    variant: "warning"
  },
  render: (args: BadgeStoryProps) => <Badge {...args} />
}`,...(I=(D=v.parameters)==null?void 0:D.docs)==null?void 0:I.source}}};var V,q,F;h.parameters={...h.parameters,docs:{...(V=h.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    children: "Layer 1 Alert",
    variant: "alert"
  },
  render: (args: BadgeStoryProps) => <Layer layer={1} style={{
    padding: "24px"
  }}>
      <Badge {...args} />
    </Layer>
}`,...(F=(q=h.parameters)==null?void 0:q.docs)==null?void 0:F.source}}};const fe=["Default","StaticAlert","StaticPrimary","StaticSuccess","StaticWarning","LayerOneAlert"];export{u as Default,h as LayerOneAlert,y as StaticAlert,B as StaticPrimary,f as StaticSuccess,v as StaticWarning,fe as __namedExportsOrder,Be as default};

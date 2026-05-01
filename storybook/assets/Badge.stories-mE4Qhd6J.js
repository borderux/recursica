import{j as r,m as X,r as Y,f as Z,$ as ee}from"./iframe-62VCHLAo.js";import{b as ae,g as x}from"./get-size-qFIEsQoM.js";import{u as re,c as se,B as te,d as oe}from"./factory-C1p_Iv34.js";import{p as ne}from"./polymorphic-factory-VSsKQd_s.js";import"./preload-helper-Dp1pzeXC.js";var K={root:"m_347db0ec","root--dot":"m_fbd81e3d",label:"m_5add502a",section:"m_91fdda9b"};const ce=oe((e,{radius:l,color:a,gradient:g,variant:t,size:o,autoContrast:c,circle:i})=>{const d=e.variantColorResolver({color:a||e.primaryColor,theme:e,gradient:g,variant:t||"filled",autoContrast:c});return{root:{"--badge-height":x(o,"badge-height"),"--badge-padding-x":x(o,"badge-padding-x"),"--badge-fz":x(o,"badge-fz"),"--badge-radius":i||l===void 0?void 0:ae(l),"--badge-bg":a||t?d.background:void 0,"--badge-color":a||t?d.color:void 0,"--badge-bd":a||t?d.border:void 0,"--badge-dot-color":t==="dot"?X(a,e):void 0}}}),_=ne((e,l)=>{const a=re("Badge",null,e),{classNames:g,className:t,style:o,styles:c,unstyled:i,vars:d,radius:P,color:p,gradient:de,leftSection:b,rightSection:S,children:M,variant:N,fullWidth:U,autoContrast:le,circle:G,mod:H,attributes:J,...Q}=a,m=se({name:"Badge",props:a,classes:K,className:t,style:o,classNames:g,styles:c,unstyled:i,attributes:J,vars:d,varsResolver:ce});return r.jsxs(te,{variant:N,mod:[{block:U,circle:G,"with-right-section":!!S,"with-left-section":!!b},H],...m("root",{variant:N}),ref:l,...Q,children:[b&&r.jsx("span",{...m("section"),"data-position":"left",children:b}),r.jsx("span",{...m("label"),children:M}),S&&r.jsx("span",{...m("section"),"data-position":"right",children:S})]})});_.classes=K;_.displayName="@mantine/core/Badge";const ie="Badge-module__root___5osNT",n={root:ie},s=Y.forwardRef(function({variant:l="primary-color",overStyled:a=!1,...g},t){const o=Z(g,a),c={root:n.root,section:n.section,label:n.label},i=o.classNames;if(i&&typeof i=="object"&&!Array.isArray(i)){const p=i;c.root=p.root?`${n.root} ${p.root}`:n.root,c.section=p.section??n.section,c.label=p.label??n.label}const d=o.className,P=d?`${n.root} ${d}`:n.root;return r.jsx(_,{ref:t,variant:"filled","data-variant":l,...o,className:P,classNames:c})});s.displayName="Badge";try{s.displayName="Badge",s.__docgenInfo={description:"",displayName:"Badge",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Badge/Badge.tsx",methods:[],props:{variant:{defaultValue:{value:"primary-color"},declarations:[{fileName:"mantine-adapter/src/components/Badge/Badge.tsx",name:"RecursicaBadgeProps"},{fileName:"mantine-adapter/src/components/Badge/Badge.tsx",name:"RecursicaBadgeProps"}],description:"Map to the component styles defined in variables",name:"variant",parent:{fileName:"mantine-adapter/src/components/Badge/Badge.tsx",name:"RecursicaBadgeProps"},required:!1,tags:{},type:{name:"enum",raw:'"alert" | "primary-color" | "success" | "warning" | undefined',value:[{value:"undefined"},{value:'"alert"'},{value:'"primary-color"'},{value:'"success"'},{value:'"warning"'}]}}},tags:{}}}catch{}const Be={title:"UI-Kit/Badge",component:s,tags:["autodocs"],argTypes:{variant:{control:"select",options:["alert","primary-color","success","warning"],description:"The style / intent mapping for the badge"}}},u={args:{children:"Badge Label",variant:"primary-color"},render:({withLayer:e,layer:l,...a})=>r.jsx(s,{...a})},y={args:{children:"Alert Badge",variant:"alert"},render:e=>r.jsx(s,{...e})},B={args:{children:"Primary Badge",variant:"primary-color"},render:e=>r.jsx(s,{...e})},f={args:{children:"Success Badge",variant:"success"},render:e=>r.jsx(s,{...e})},v={args:{children:"Warning Badge",variant:"warning"},render:e=>r.jsx(s,{...e})},h={args:{children:"Layer 1 Alert",variant:"alert"},render:e=>r.jsx(ee,{layer:1,style:{padding:"24px"},children:r.jsx(s,{...e})})};var j,w,A;u.parameters={...u.parameters,docs:{...(j=u.parameters)==null?void 0:j.docs,source:{originalSource:`{
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
}`,...(A=(w=u.parameters)==null?void 0:w.docs)==null?void 0:A.source}}};var L,R,C;y.parameters={...y.parameters,docs:{...(L=y.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    children: "Alert Badge",
    variant: "alert"
  },
  render: (args: BadgeStoryProps) => <Badge {...args} />
}`,...(C=(R=y.parameters)==null?void 0:R.docs)==null?void 0:C.source}}};var $,W,k;B.parameters={...B.parameters,docs:{...($=B.parameters)==null?void 0:$.docs,source:{originalSource:`{
  args: {
    children: "Primary Badge",
    variant: "primary-color"
  },
  render: (args: BadgeStoryProps) => <Badge {...args} />
}`,...(k=(W=B.parameters)==null?void 0:W.docs)==null?void 0:k.source}}};var T,E,O;f.parameters={...f.parameters,docs:{...(T=f.parameters)==null?void 0:T.docs,source:{originalSource:`{
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

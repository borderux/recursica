import{j as r,e as Y,r as Z}from"./iframe-BmfdKJen.js";import{f as ee}from"./filterStylingProps-D6XLjxMq.js";import{p as re,u as ae,a as se,B as te,c as oe,g as ne,b as x}from"./polymorphic-factory-kKMArxXM.js";import{T as K}from"./adapter-common-DrbnELqL.js";import"./preload-helper-Dp1pzeXC.js";var M={root:"m_347db0ec","root--dot":"m_fbd81e3d",label:"m_5add502a",section:"m_91fdda9b"};const ie=oe((e,{radius:d,color:a,gradient:l,variant:o,size:n,autoContrast:c})=>{const s=e.variantColorResolver({color:a||e.primaryColor,theme:e,gradient:l,variant:o||"filled",autoContrast:c});return{root:{"--badge-height":x(n,"badge-height"),"--badge-padding-x":x(n,"badge-padding-x"),"--badge-fz":x(n,"badge-fz"),"--badge-radius":d===void 0?void 0:ne(d),"--badge-bg":a||o?s.background:void 0,"--badge-color":a||o?s.color:void 0,"--badge-bd":a||o?s.border:void 0,"--badge-dot-color":o==="dot"?Y(a,e):void 0}}}),_=re((e,d)=>{const a=ae("Badge",null,e),{classNames:l,className:o,style:n,styles:c,unstyled:s,vars:p,radius:j,color:g,gradient:ce,leftSection:S,rightSection:B,children:U,variant:N,fullWidth:G,autoContrast:le,circle:H,mod:J,attributes:Q,...X}=a,m=se({name:"Badge",props:a,classes:M,className:o,style:n,classNames:l,styles:c,unstyled:s,attributes:Q,vars:p,varsResolver:ie});return r.jsxs(te,{variant:N,mod:[{block:G,circle:H,"with-right-section":!!B,"with-left-section":!!S},J],...m("root",{variant:N}),ref:d,...X,children:[S&&r.jsx("span",{...m("section"),"data-position":"left",children:S}),r.jsx("span",{...m("label"),children:U}),B&&r.jsx("span",{...m("section"),"data-position":"right",children:B})]})});_.classes=M;_.displayName="@mantine/core/Badge";const de="Badge-module__root___5osNT",i={root:de},t=Z.forwardRef(function({variant:d="primary-color",overStyled:a=!1,...l},o){const n=ee(l,a),c={root:i.root,section:i.section,label:i.label},s=n.classNames;if(s&&typeof s=="object"&&!Array.isArray(s)){const g=s;c.root=g.root?`${i.root} ${g.root}`:i.root,c.section=g.section??i.section,c.label=g.label??i.label}const p=n.className,j=p?`${i.root} ${p}`:i.root;return r.jsx(_,{ref:o,variant:"filled","data-variant":d,...n,className:j,classNames:c})});t.displayName="Badge";try{t.displayName="Badge",t.__docgenInfo={description:"",displayName:"Badge",props:{variant:{defaultValue:{value:"primary-color"},description:"Map to the component styles defined in variables",name:"variant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"alert"'},{value:'"primary-color"'},{value:'"success"'},{value:'"warning"'}]}},overStyled:{defaultValue:{value:"false"},description:"",name:"overStyled",required:!1,type:{name:"boolean | undefined"}}}}}catch{}const ve={title:"UI-Kit/Badge",component:t,tags:["autodocs"],argTypes:{variant:{control:"select",options:["alert","primary-color","success","warning"],description:"The style / intent mapping for the badge"},overStyled:{control:"boolean",description:"Allow generic external styles to override base kit limits"},layer:{control:"radio",options:[0,1,2,3],description:"The design system layer context",table:{category:"Story Controls"}}}},u={args:{children:"Badge Label",variant:"primary-color",overStyled:!1,layer:0},render:({layer:e=0,...d})=>r.jsx(K,{layer:e,style:{padding:"24px"},children:r.jsx(t,{...d})})},y={args:{children:"Alert Badge",variant:"alert"},render:e=>r.jsx(t,{...e})},v={args:{children:"Primary Badge",variant:"primary-color"},render:e=>r.jsx(t,{...e})},f={args:{children:"Success Badge",variant:"success"},render:e=>r.jsx(t,{...e})},b={args:{children:"Warning Badge",variant:"warning"},render:e=>r.jsx(t,{...e})},h={args:{children:"Layer 1 Alert",variant:"alert"},render:e=>r.jsx(K,{layer:1,style:{padding:"24px"},children:r.jsx(t,{...e})})};var A,L,P;u.parameters={...u.parameters,docs:{...(A=u.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    children: "Badge Label",
    variant: "primary-color",
    overStyled: false,
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
}`,...(P=(L=u.parameters)==null?void 0:L.docs)==null?void 0:P.source}}};var w,C,R;y.parameters={...y.parameters,docs:{...(w=y.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    children: "Alert Badge",
    variant: "alert"
  },
  render: args => <Badge {...args} />
}`,...(R=(C=y.parameters)==null?void 0:C.docs)==null?void 0:R.source}}};var T,W,$;v.parameters={...v.parameters,docs:{...(T=v.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    children: "Primary Badge",
    variant: "primary-color"
  },
  render: args => <Badge {...args} />
}`,...($=(W=v.parameters)==null?void 0:W.docs)==null?void 0:$.source}}};var k,E,O;f.parameters={...f.parameters,docs:{...(k=f.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    children: "Success Badge",
    variant: "success"
  },
  render: args => <Badge {...args} />
}`,...(O=(E=f.parameters)==null?void 0:E.docs)==null?void 0:O.source}}};var V,q,z;b.parameters={...b.parameters,docs:{...(V=b.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    children: "Warning Badge",
    variant: "warning"
  },
  render: args => <Badge {...args} />
}`,...(z=(q=b.parameters)==null?void 0:q.docs)==null?void 0:z.source}}};var D,I,F;h.parameters={...h.parameters,docs:{...(D=h.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    children: "Layer 1 Alert",
    variant: "alert"
  },
  render: args => <Layer layer={1} style={{
    padding: "24px"
  }}>
      <Badge {...args} />
    </Layer>
}`,...(F=(I=h.parameters)==null?void 0:I.docs)==null?void 0:F.source}}};const fe=["Default","StaticAlert","StaticPrimary","StaticSuccess","StaticWarning","LayerOneAlert"];export{u as Default,h as LayerOneAlert,y as StaticAlert,v as StaticPrimary,f as StaticSuccess,b as StaticWarning,fe as __namedExportsOrder,ve as default};

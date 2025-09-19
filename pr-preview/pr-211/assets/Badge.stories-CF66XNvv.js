import{j as l,g as se}from"./iframe-Dco5fZMG.js";import{c as re,g as te,b as v}from"./Typography.css.ts.vanilla-DIYsSTOB.js";import{p as oe,u as le,a as de}from"./polymorphic-factory-DL10f-W2.js";import{B as ne}from"./Box-D-RJN25I.js";import"./preload-helper-CZ_saIiD.js";var M={root:"m_347db0ec","root--dot":"m_fbd81e3d",label:"m_5add502a",section:"m_91fdda9b"};const ce=re((a,{radius:r,color:e,gradient:b,variant:s,size:t,autoContrast:f})=>{const o=a.variantColorResolver({color:e||a.primaryColor,theme:a,gradient:b,variant:s||"filled",autoContrast:f});return{root:{"--badge-height":v(t,"badge-height"),"--badge-padding-x":v(t,"badge-padding-x"),"--badge-fz":v(t,"badge-fz"),"--badge-radius":r===void 0?void 0:te(r),"--badge-bg":e||s?o.background:void 0,"--badge-color":e||s?o.color:void 0,"--badge-bd":e||s?o.border:void 0,"--badge-dot-color":s==="dot"?se(e,a):void 0}}}),_=oe((a,r)=>{const e=le("Badge",null,a),{classNames:b,className:s,style:t,styles:f,unstyled:o,vars:Q,radius:ge,color:ue,gradient:pe,leftSection:h,rightSection:B,children:U,variant:S,fullWidth:X,autoContrast:me,circle:Y,mod:Z,attributes:ee,...ae}=e,d=de({name:"Badge",props:e,classes:M,className:s,style:t,classNames:b,styles:f,unstyled:o,attributes:ee,vars:Q,varsResolver:ce});return l.jsxs(ne,{variant:S,mod:[{block:X,circle:Y,"with-right-section":!!B,"with-left-section":!!h},Z],...d("root",{variant:S}),ref:r,...ae,children:[h&&l.jsx("span",{...d("section"),"data-position":"left",children:h}),l.jsx("span",{...d("label"),children:U}),B&&l.jsx("span",{...d("section"),"data-position":"right",children:B})]})});_.classes=M;_.displayName="@mantine/core/Badge";var ie={root:"recursica-3qunx40",label:"recursica-3qunx41"};function z({label:a,size:r="default",style:e="primary"}){return l.jsx(_,{classNames:ie,"data-size":r,"data-style":e,children:a})}try{z.displayName="Badge",z.__docgenInfo={description:"",displayName:"Badge",props:{label:{defaultValue:null,description:"The label to display in the badge.",name:"label",required:!0,type:{name:"string | number"}},size:{defaultValue:{value:"default"},description:"The size of the badge.",name:"size",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"default"'},{value:'"large"'}]}},style:{defaultValue:{value:"primary"},description:"The style of the badge.",name:"style",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"primary"'},{value:'"ghost"'},{value:'"alert"'},{value:'"success"'}]}}}}}catch{}const ve={title:"Badge",component:z,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{size:{control:{type:"select"},options:["default","large"]},style:{control:{type:"select"},options:["primary","ghost","alert","success"]}},args:{}},n={args:{label:"Badge",size:"default",style:"primary"}},c={args:{label:"Badge",size:"default",style:"ghost"}},i={args:{label:"Badge",size:"default",style:"alert"}},g={args:{label:"Badge",size:"default",style:"success"}},u={args:{label:"Badge",size:"large",style:"primary"}},p={args:{label:"Badge",size:"large",style:"ghost"}},m={args:{label:"Badge",size:"large",style:"alert"}},y={args:{label:"Badge",size:"large",style:"success"}};var x,L,j;n.parameters={...n.parameters,docs:{...(x=n.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    label: "Badge",
    size: "default",
    style: "primary"
  }
}`,...(j=(L=n.parameters)==null?void 0:L.docs)==null?void 0:j.source}}};var N,q,P;c.parameters={...c.parameters,docs:{...(N=c.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    label: "Badge",
    size: "default",
    style: "ghost"
  }
}`,...(P=(q=c.parameters)==null?void 0:q.docs)==null?void 0:P.source}}};var R,T,A;i.parameters={...i.parameters,docs:{...(R=i.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    label: "Badge",
    size: "default",
    style: "alert"
  }
}`,...(A=(T=i.parameters)==null?void 0:T.docs)==null?void 0:A.source}}};var C,G,V;g.parameters={...g.parameters,docs:{...(C=g.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    label: "Badge",
    size: "default",
    style: "success"
  }
}`,...(V=(G=g.parameters)==null?void 0:G.docs)==null?void 0:V.source}}};var k,w,E;u.parameters={...u.parameters,docs:{...(k=u.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    label: "Badge",
    size: "large",
    style: "primary"
  }
}`,...(E=(w=u.parameters)==null?void 0:w.docs)==null?void 0:E.source}}};var F,I,O;p.parameters={...p.parameters,docs:{...(F=p.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    label: "Badge",
    size: "large",
    style: "ghost"
  }
}`,...(O=(I=p.parameters)==null?void 0:I.docs)==null?void 0:O.source}}};var W,$,D;m.parameters={...m.parameters,docs:{...(W=m.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    label: "Badge",
    size: "large",
    style: "alert"
  }
}`,...(D=($=m.parameters)==null?void 0:$.docs)==null?void 0:D.source}}};var H,J,K;y.parameters={...y.parameters,docs:{...(H=y.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    label: "Badge",
    size: "large",
    style: "success"
  }
}`,...(K=(J=y.parameters)==null?void 0:J.docs)==null?void 0:K.source}}};const ze=["Primary","Ghost","Alert","Success","PrimaryLarge","GhostLarge","AlertLarge","SuccessLarge"];export{i as Alert,m as AlertLarge,c as Ghost,p as GhostLarge,n as Primary,u as PrimaryLarge,g as Success,y as SuccessLarge,ze as __namedExportsOrder,ve as default};

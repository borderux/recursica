import{j as s,g as oe,b as ae,r as p}from"./iframe-CaYtvSrb.js";import{c as Y,d as ce,e as ie,a as me}from"./Typography.css.ts.vanilla-BTGOHLvo.js";import{I as z}from"./Icon-P8eDKGJe.js";import{B as v,a as de}from"./Box-DI5237On.js";import{p as Z,u as H,a as ee,f as ue}from"./polymorphic-factory-BpB2RHWM.js";import{i as le}from"./is-element-CUIdsI35.js";import"./preload-helper-CZ_saIiD.js";var re={root:"m_b6d8b162"};function pe(e){if(e==="start")return"start";if(e==="end"||e)return"end"}const fe={inherit:!1},he=Y((e,{variant:t,lineClamp:n,gradient:a,size:r,color:o})=>({root:{"--text-fz":ie(r),"--text-lh":ce(r),"--text-gradient":t==="gradient"?ae(a,e):void 0,"--text-line-clamp":typeof n=="number"?n.toString():void 0,"--text-color":o?oe(o,e):void 0}})),R=Z((e,t)=>{const n=H("Text",fe,e),{lineClamp:a,truncate:r,inline:o,inherit:c,gradient:f,span:i,__staticSelector:N,vars:j,className:q,style:S,classNames:B,styles:m,unstyled:P,variant:l,mod:d,size:u,attributes:A,...E}=n,h=ee({name:["Text",N],props:n,classes:re,className:q,style:S,classNames:B,styles:m,unstyled:P,attributes:A,vars:j,varsResolver:he});return s.jsx(v,{...h("root",{focusable:!0}),ref:t,component:i?"span":"p",variant:l,mod:[{"data-truncate":pe(r),"data-line-clamp":typeof a=="number","data-inline":o,"data-inherit":c},d],size:u,...E})});R.classes=re;R.displayName="@mantine/core/Text";var te={root:"m_849cf0da"};const xe={underline:"hover"},$=Z((e,t)=>{const{underline:n,className:a,unstyled:r,mod:o,...c}=H("Anchor",xe,e);return s.jsx(R,{component:"a",ref:t,className:de({[te.root]:!r},a),...c,mod:[{underline:n},o],__staticSelector:"Anchor",unstyled:r})});$.classes=te;$.displayName="@mantine/core/Anchor";var ne={root:"m_8b3717df",breadcrumb:"m_f678d540",separator:"m_3b8f2208"};const ge={separator:"/"},_e=Y((e,{separatorMargin:t})=>({root:{"--bc-separator-margin":me(t)}})),V=ue((e,t)=>{const n=H("Breadcrumbs",ge,e),{classNames:a,className:r,style:o,styles:c,unstyled:f,vars:i,children:N,separator:j,separatorMargin:q,attributes:S,...B}=n,m=ee({name:"Breadcrumbs",classes:ne,props:n,className:r,style:o,classNames:a,styles:c,unstyled:f,attributes:S,vars:i,varsResolver:_e}),P=p.Children.toArray(N).reduce((l,d,u,A)=>{var h;const E=le(d)?p.cloneElement(d,{...m("breadcrumb",{className:(h=d.props)==null?void 0:h.className}),key:u}):p.createElement("div",{...m("breadcrumb"),key:u},d);return l.push(E),u!==A.length-1&&l.push(p.createElement(v,{...m("separator"),key:`separator-${u}`},j)),l},[]);return s.jsx(v,{ref:t,...m("root"),...B,children:P})});V.classes=ne;V.displayName="@mantine/core/Breadcrumbs";var ye={root:"recursica-39pmvp0",separator:"recursica-39pmvp1",breadcrumb:"recursica-39pmvp2"};function I({children:e,...t}){return s.jsx($,{style:{color:"currentcolor",fontSize:"inherit"},...t,children:e})}try{I.displayName="Anchor",I.__docgenInfo={description:"",displayName:"Anchor",props:{href:{defaultValue:null,description:"",name:"href",required:!0,type:{name:"string"}},target:{defaultValue:null,description:"",name:"target",required:!1,type:{name:"string | undefined"}},rel:{defaultValue:null,description:"",name:"rel",required:!1,type:{name:"string | undefined"}},download:{defaultValue:null,description:"",name:"download",required:!1,type:{name:"string | undefined"}}}}}catch{}const se=p.forwardRef(({items:e,...t},n)=>{const a=e.map((r,o)=>{const c=!!r.icon,f=!!r.text,i=s.jsxs(s.Fragment,{children:[c&&s.jsx(z,{name:r.icon,size:16}),f&&s.jsx("span",{children:r.text})]});return r.href?s.jsx(I,{underline:"never",href:r.href,"data-interactive":"true",children:i},o):s.jsx(v,{component:"span","data-interactive":"false",children:i},o)});return s.jsx(V,{ref:n,separator:s.jsx(z,{name:"slash_outline",size:16}),classNames:ye,...t,children:a})});se.displayName="Breadcrumb";const T=se;try{T.displayName="Breadcrumb",T.__docgenInfo={description:"",displayName:"Breadcrumb",props:{items:{defaultValue:null,description:"Array of breadcrumb items",name:"items",required:!0,type:{name:"BreadcrumbItem[]"}}}}}catch{}const Ae={title:"Breadcrumb",component:T,parameters:{layout:"centered"},tags:["autodocs"]},x={args:{items:[{text:"Home",href:"/"},{text:"Products",href:"/products"},{text:"Electronics"}]}},g={args:{items:[{text:"Home",icon:"home_outline",href:"/"},{text:"Products",icon:"shopping_bag_outline",href:"/products"},{text:"Electronics"}]}},_={args:{items:[{icon:"home_outline",href:"/"},{icon:"folder_outline",href:"/documents"},{icon:"document_outline"}]}},y={args:{items:[{text:"Home",href:"/"},{icon:"folder_outline",href:"/documents"},{text:"Reports",icon:"document_outline",href:"/documents/reports"},{text:"Q4 2023"}]}},b={args:{items:[{text:"Home",href:"/"},{text:"Admin",href:"/admin"},{text:"Users",href:"/admin/users"},{text:"User Management",href:"/admin/users/management"},{text:"John Doe",href:"/admin/users/management/john-doe"},{text:"Profile"}]}};var M,O,w;x.parameters={...x.parameters,docs:{...(M=x.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    items: [{
      text: "Home",
      href: "/"
    }, {
      text: "Products",
      href: "/products"
    }, {
      text: "Electronics"
    }]
  }
}`,...(w=(O=x.parameters)==null?void 0:O.docs)==null?void 0:w.source}}};var C,F,U;g.parameters={...g.parameters,docs:{...(C=g.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    items: [{
      text: "Home",
      icon: "home_outline",
      href: "/"
    }, {
      text: "Products",
      icon: "shopping_bag_outline",
      href: "/products"
    }, {
      text: "Electronics"
    }]
  }
}`,...(U=(F=g.parameters)==null?void 0:F.docs)==null?void 0:U.source}}};var k,L,D;_.parameters={..._.parameters,docs:{...(k=_.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    items: [{
      icon: "home_outline",
      href: "/"
    }, {
      icon: "folder_outline",
      href: "/documents"
    }, {
      icon: "document_outline"
    }]
  }
}`,...(D=(L=_.parameters)==null?void 0:L.docs)==null?void 0:D.source}}};var J,Q,W;y.parameters={...y.parameters,docs:{...(J=y.parameters)==null?void 0:J.docs,source:{originalSource:`{
  args: {
    items: [{
      text: "Home",
      href: "/"
    }, {
      icon: "folder_outline",
      href: "/documents"
    }, {
      text: "Reports",
      icon: "document_outline",
      href: "/documents/reports"
    }, {
      text: "Q4 2023"
    }]
  }
}`,...(W=(Q=y.parameters)==null?void 0:Q.docs)==null?void 0:W.source}}};var G,K,X;b.parameters={...b.parameters,docs:{...(G=b.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    items: [{
      text: "Home",
      href: "/"
    }, {
      text: "Admin",
      href: "/admin"
    }, {
      text: "Users",
      href: "/admin/users"
    }, {
      text: "User Management",
      href: "/admin/users/management"
    }, {
      text: "John Doe",
      href: "/admin/users/management/john-doe"
    }, {
      text: "Profile"
    }]
  }
}`,...(X=(K=b.parameters)==null?void 0:K.docs)==null?void 0:X.source}}};const Ee=["TextOnly","WithIcons","IconOnly","MixedContent","LongPath"];export{_ as IconOnly,b as LongPath,y as MixedContent,x as TextOnly,g as WithIcons,Ee as __namedExportsOrder,Ae as default};

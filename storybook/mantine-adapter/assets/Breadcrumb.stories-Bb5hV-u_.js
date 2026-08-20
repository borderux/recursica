import{j as s}from"./iframe-BaN8EIKL.js";import{B as o}from"./Breadcrumb-D8NjIp2W.js";import{L as y}from"./Link-BNq8MNRk.js";import"./preload-helper-Dp1pzeXC.js";import"./is-element-BiFRcqCx.js";import"./get-size-DxiyYKv9.js";import"./factory-B0Jv6HX0.js";import"./polymorphic-factory-DzFPP9uC.js";import"./Text-Bx_bLDxn.js";const v={title:"UI-Kit/Breadcrumb",component:o,tags:["autodocs"],argTypes:{children:{table:{disable:!0}},items:{control:"object",description:"Array of string labels used to dynamically generate the interactive Breadcrumb nodes.",table:{category:"Story Controls"}},separator:{control:"text",description:"Custom separator between items"}},args:{items:["Home","Components","Breadcrumbs"]},render:({items:a,children:S,...b})=>{const f=a?a.map((h,x)=>s.jsx(y,{href:"#",children:h},x)):S;return s.jsx(o,{children:f,...b})}},r={args:{items:["Dashboard","Settings","Security"]}},e={args:{items:["Store","Electronics","Computers","Laptops"]}},t={args:{items:["Root","Branch","Leaf"],separator:"→"}};var m,n,c;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    items: ["Dashboard", "Settings", "Security"]
  }
}`,...(c=(n=r.parameters)==null?void 0:n.docs)==null?void 0:c.source}}};var i,p,d;e.parameters={...e.parameters,docs:{...(i=e.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    items: ["Store", "Electronics", "Computers", "Laptops"]
  }
}`,...(d=(p=e.parameters)==null?void 0:p.docs)==null?void 0:d.source}}};var u,l,g;t.parameters={...t.parameters,docs:{...(u=t.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    items: ["Root", "Branch", "Leaf"],
    separator: "→"
  }
}`,...(g=(l=t.parameters)==null?void 0:l.docs)==null?void 0:g.source}}};const w=["Default","StaticExample","CustomSeparator"];export{t as CustomSeparator,r as Default,e as StaticExample,w as __namedExportsOrder,v as default};

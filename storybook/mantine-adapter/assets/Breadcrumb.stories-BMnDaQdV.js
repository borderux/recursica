import{j as s}from"./iframe-oYtE5cjn.js";import{B as o}from"./Breadcrumb-DCuz1TM_.js";import{L as y}from"./Link-CERr6rs1.js";import"./preload-helper-Dp1pzeXC.js";import"./is-element-Ohp0Jv7o.js";import"./get-size-DSTSojjy.js";import"./factory-cPRSk-ET.js";import"./polymorphic-factory-dVyCEWHC.js";import"./Text-COc5EdYV.js";const v={title:"UI-Kit/Breadcrumb",component:o,tags:["autodocs"],argTypes:{children:{table:{disable:!0}},items:{control:"object",description:"Array of string labels used to dynamically generate the interactive Breadcrumb nodes.",table:{category:"Story Controls"}},separator:{control:"text",description:"Custom separator between items"}},args:{items:["Home","Components","Breadcrumbs"]},render:({items:a,children:S,...b})=>{const f=a?a.map((h,x)=>s.jsx(y,{href:"#",children:h},x)):S;return s.jsx(o,{children:f,...b})}},r={args:{items:["Dashboard","Settings","Security"]}},e={args:{items:["Store","Electronics","Computers","Laptops"]}},t={args:{items:["Root","Branch","Leaf"],separator:"→"}};var m,n,c;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`{
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

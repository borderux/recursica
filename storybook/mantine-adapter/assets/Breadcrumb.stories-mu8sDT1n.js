import{j as o}from"./iframe-alR3zAUJ.js";import{B as s}from"./Breadcrumb-CHOoBtDv.js";import"./preload-helper-Dp1pzeXC.js";import"./is-element-DuidDaRH.js";import"./get-size-CgeYFbt0.js";import"./factory-Dof06U1Z.js";const D={title:"UI-Kit/Breadcrumb",component:s,tags:["autodocs"],argTypes:{children:{table:{disable:!0}},items:{control:"object",description:"Array of string labels used to dynamically generate the interactive Breadcrumb nodes.",table:{category:"Story Controls"}},separator:{control:"text",description:"Custom separator between items"}},args:{items:["Home","Components","Breadcrumbs"]},render:({items:a,children:S,...b})=>{const f=a?a.map((h,x)=>o.jsx("a",{href:"#",style:{color:"var(--recursica_brand_palettes_primary_default_color_tone)",textDecoration:"none"},children:h},x)):S;return o.jsx(s,{children:f,...b})}},r={args:{items:["Dashboard","Settings","Security"]}},e={args:{items:["Store","Electronics","Computers","Laptops"]}},t={args:{items:["Root","Branch","Leaf"],separator:"→"}};var c,n,m;r.parameters={...r.parameters,docs:{...(c=r.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    items: ["Dashboard", "Settings", "Security"]
  }
}`,...(m=(n=r.parameters)==null?void 0:n.docs)==null?void 0:m.source}}};var i,p,d;e.parameters={...e.parameters,docs:{...(i=e.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    items: ["Store", "Electronics", "Computers", "Laptops"]
  }
}`,...(d=(p=e.parameters)==null?void 0:p.docs)==null?void 0:d.source}}};var l,u,g;t.parameters={...t.parameters,docs:{...(l=t.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    items: ["Root", "Branch", "Leaf"],
    separator: "→"
  }
}`,...(g=(u=t.parameters)==null?void 0:u.docs)==null?void 0:g.source}}};const L=["Default","StaticExample","CustomSeparator"];export{t as CustomSeparator,r as Default,e as StaticExample,L as __namedExportsOrder,D as default};

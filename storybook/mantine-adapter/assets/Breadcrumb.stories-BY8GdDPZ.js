import{j as a}from"./iframe-Hqhg3Da1.js";import{B as o}from"./Breadcrumb-DwwdV3zr.js";import{L as f}from"./Link-KXSJ3Bsj.js";import"./preload-helper-Dp1pzeXC.js";import"./is-element-DYrWi5C8.js";import"./get-size-CFz4_vy9.js";import"./factory-BczmY60U.js";import"./polymorphic-factory-CnqVX0h6.js";import"./Text-DUXr-bGA.js";const R={title:"UI-Kit/Breadcrumb",component:o,tags:["autodocs"],argTypes:{children:{table:{disable:!0}},items:{control:"object",description:"Array of string labels used to dynamically generate the interactive Breadcrumb nodes.",table:{category:"Story Controls"}},separator:{control:"text",description:"Custom separator between items"}},args:{items:["Home","Components","Breadcrumbs"]},render:({items:t,children:d,...u})=>{const l=t?t.map((g,b)=>a.jsx(f,{href:"#",children:g},b)):d;return a.jsx(o,{children:l,...u})}},r={args:{items:["Dashboard","Settings","Security"]}},e={args:{items:["Root","Branch","Leaf"],separator:"→"}};var s,n,m;r.parameters={...r.parameters,docs:{...(s=r.parameters)==null?void 0:s.docs,source:{originalSource:`{
  args: {
    items: ["Dashboard", "Settings", "Security"]
  }
}`,...(m=(n=r.parameters)==null?void 0:n.docs)==null?void 0:m.source}}};var i,c,p;e.parameters={...e.parameters,docs:{...(i=e.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    items: ["Root", "Branch", "Leaf"],
    separator: "→"
  }
}`,...(p=(c=e.parameters)==null?void 0:c.docs)==null?void 0:p.source}}};const E=["Default","CustomSeparator"];export{e as CustomSeparator,r as Default,E as __namedExportsOrder,R as default};

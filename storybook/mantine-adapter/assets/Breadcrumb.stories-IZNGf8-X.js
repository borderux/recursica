import{j as a}from"./iframe-BhJzpr4o.js";import{B as o}from"./Breadcrumb-D1utoCP9.js";import{L as f}from"./Link-zO4J65-M.js";import"./preload-helper-Dp1pzeXC.js";import"./is-element-Cm6K1qwy.js";import"./get-size-BKvCx1J8.js";import"./factory-tKsKK_bA.js";import"./polymorphic-factory-CpsWuxBI.js";import"./Text-DK80bH_A.js";const R={title:"UI-Kit/Breadcrumb",component:o,tags:["autodocs"],argTypes:{children:{table:{disable:!0}},items:{control:"object",description:"Array of string labels used to dynamically generate the interactive Breadcrumb nodes.",table:{category:"Story Controls"}},separator:{control:"text",description:"Custom separator between items"}},args:{items:["Home","Components","Breadcrumbs"]},render:({items:t,children:d,...u})=>{const l=t?t.map((g,b)=>a.jsx(f,{href:"#",children:g},b)):d;return a.jsx(o,{children:l,...u})}},r={args:{items:["Dashboard","Settings","Security"]}},e={args:{items:["Root","Branch","Leaf"],separator:"→"}};var s,n,m;r.parameters={...r.parameters,docs:{...(s=r.parameters)==null?void 0:s.docs,source:{originalSource:`{
  args: {
    items: ["Dashboard", "Settings", "Security"]
  }
}`,...(m=(n=r.parameters)==null?void 0:n.docs)==null?void 0:m.source}}};var i,c,p;e.parameters={...e.parameters,docs:{...(i=e.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    items: ["Root", "Branch", "Leaf"],
    separator: "→"
  }
}`,...(p=(c=e.parameters)==null?void 0:c.docs)==null?void 0:p.source}}};const E=["Default","CustomSeparator"];export{e as CustomSeparator,r as Default,E as __namedExportsOrder,R as default};
